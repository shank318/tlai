import { useEffect, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import { ArrowRight, Check, ChevronDown, FileCode2, Menu, X } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import { primitiveById, primitives, type Approach, type Problem, type Primitive, type PrimitiveId } from '../content/data'

export function Header() {
  const [open, setOpen] = useState(false)
  return <header className="header"><div className="nav-wrap"><Link className="brand" to="/" onClick={()=>setOpen(false)}><span className="brand-mark">T<span>/</span>AI</span><span>ThinkLikeAIEngineer<span className="brand-period">.</span></span></Link><button className="menu-button" aria-label="Toggle navigation" aria-expanded={open} aria-controls="main-navigation" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button><nav id="main-navigation" className={open?'nav open':'nav'}><NavLink to="/problems" onClick={()=>setOpen(false)}>Problems</NavLink><NavLink to="/primitives" onClick={()=>setOpen(false)}>Functions</NavLink><Link className="button small" to="/waitlist" onClick={()=>setOpen(false)}>Join waitlist <ArrowRight size={14}/></Link></nav></div></header>
}

export function Footer() { return <footer><div className="footer-inner"><div><div className="brand"><span className="brand-mark">T<span>/</span>AI</span><span>ThinkLikeAIEngineer<span className="brand-period">.</span></span></div><p>Practical mental models for building with AI.</p></div><div className="footer-links"><Link to="/problems">Problems</Link><Link to="/primitives">Functions</Link><Link to="/waitlist">Waitlist</Link></div></div></footer> }

export function Page({children}: {children: ReactNode}) {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }) }, [pathname])
  return <><Header/><main>{children}</main><Footer/></>
}

export function SEO({title, description}: {title: string; description: string}) {
  useEffect(()=>{ document.title = `${title} — Think Like an AI Engineer`; document.querySelector('meta[name="description"]')?.setAttribute('content', description) }, [title, description])
  return null
}

function primitiveStyle(primitive: Primitive): CSSProperties {
  return { '--primitive-color': primitive.color, '--primitive-tint': primitive.tint } as CSSProperties
}

export function PrimitiveName({id}: {id: PrimitiveId}) {
  const primitive = primitiveById(id)!
  return <span className="primitive-name" style={primitiveStyle(primitive)}>{primitive.name}</span>
}

export function PrimitiveLink({id, children, inline=false}: {id: PrimitiveId; children?: ReactNode; inline?: boolean}) {
  const primitive = primitiveById(id)!
  return <Link className={inline?'primitive-call':'primitive-badge'} to={`/primitives/${id}`} style={primitiveStyle(primitive)} data-primitive={id} title={`${primitive.name}\n${primitive.capability}\nReturns: ${primitive.returns}`} aria-label={`${primitive.name} — open function documentation`}>{children ?? primitive.name}</Link>
}

function codeTokens(code: string): ReactNode[] {
  const tokens: ReactNode[] = []
  const pattern = /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\/\/[^\n]*|\/\*[\s\S]*?\*\/|\b[A-Za-z_$][\w$]*\b|\b\d+(?:\.\d+)?\b/g
  const keywords = new Set(['const','let','await','async','if','else','return','for','of','in','break','function','type','interface','string','number','boolean','unknown','null','true','false','new'])
  let position = 0
  for (const match of code.matchAll(pattern)) {
    const index = match.index!
    const token = match[0]
    if (index > position) tokens.push(code.slice(position, index))
    const primitive = primitiveById(token)
    const isCall = /^\s*(?:<[^;\n]*?>\s*)?\(/.test(code.slice(index + token.length))
    const isProperty = code.slice(0, index).trimEnd().endsWith('.')
    if (token.startsWith('//') || token.startsWith('/*')) tokens.push(<span className="code-comment" key={index}>{token}</span>)
    else if (/^["'`]/.test(token)) tokens.push(<span className="code-string" key={index}>{token}</span>)
    else if (primitive && isCall && !isProperty) tokens.push(<PrimitiveLink key={index} id={primitive.id} inline>{token}</PrimitiveLink>)
    else if (keywords.has(token)) tokens.push(<span className="code-keyword" key={index}>{token}</span>)
    else if (/^\d/.test(token)) tokens.push(<span className="code-number" key={index}>{token}</span>)
    else tokens.push(token)
    position = index + token.length
  }
  if (position < code.length) tokens.push(code.slice(position))
  return tokens
}

export function PseudoCode({code, label='CODE USAGE', compact=false}: {code: string; label?: string; compact?: boolean}) {
  return <div className={`pseudo-code ${compact?'compact':''}`}><div className="code-toolbar"><span><FileCode2 size={15}/>{label}</span><span>TypeScript · pseudo-code</span></div><pre tabIndex={0} aria-label="TypeScript pseudo-code"><code>{codeTokens(code)}</code></pre><div className="code-footer"><span className="code-color-dot"/>Colored functions are clickable. Everything else is ordinary application code.</div></div>
}

export function ProblemCard({problem}: {problem: Problem}) { return <Link to={`/problems/${problem.slug}`} className="problem-card"><div className="card-meta"><span>{problem.category}</span><span>{problem.difficulty}</span></div><h3>{problem.title}</h3><p>{problem.description}</p><div className="problem-functions">{[...new Set(problem.approaches.flatMap(a=>a.primitives))].slice(0,4).map(id=><PrimitiveName key={id} id={id}/>)}</div><div className="card-footer"><span>{problem.approaches.length} approaches</span><ArrowRight size={17}/></div></Link> }
export function ProblemList({problems}: {problems: Problem[]}) { return <div className="problem-grid">{problems.map(p=><ProblemCard key={p.slug} problem={p}/>)}</div> }

export function PrimitiveDiagram({primitive}: {primitive: Primitive}) { return <div className="function-diagram" style={primitiveStyle(primitive)}><div><span>INPUT</span><code>{primitive.input}</code></div><ArrowRight aria-hidden="true"/><strong>{primitive.name}</strong><ArrowRight aria-hidden="true"/><div><span>OUTPUT</span><code>{primitive.output}</code></div></div> }
export function PrimitiveCard({primitive}: {primitive: Primitive}) { return <Link to={`/primitives/${primitive.id}`} className="function-card" style={primitiveStyle(primitive)}><div className="function-card-top"><span className="function-swatch"/><span>{primitive.capability}</span><ArrowRight size={16}/></div><h3>{primitive.name}</h3><p>{primitive.short}</p><div className="function-card-return"><span>RETURNS</span><code>{primitive.output}</code></div></Link> }

export function ApproachSection({number,title,summary,code,takeaway,tradeoff,measure,primitives:ids}: Approach & {number:number}) {
  const [open,setOpen]=useState(number===1)
  return <section className={`approach ${open?'expanded':''}`}><button className="approach-head" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls={`approach-${number}`}><span className="approach-number">0{number}</span><span><strong>{title}</strong><small>{summary}</small></span><ChevronDown/></button>{open&&<div className="approach-body code-approach" id={`approach-${number}`}><div className="approach-functions">{ids.length?ids.map(id=><PrimitiveLink key={id} id={id}/>):<span className="no-ai-label"><Check size={14}/>No AI needed. That’s a valid design.</span>}</div><PseudoCode code={code}/><div className="approach-takeaway"><span>THE MENTAL MODEL</span><p>{takeaway}</p></div><div className="approach-notes"><div><span>THE TRADE-OFF</span><p>{tradeoff}</p></div><div><span>WHAT TO MEASURE</span><p>{measure}</p></div></div></div>}</section>
}

export function FunctionLegend() { return <div className="function-legend"><span>THE FUNCTION PALETTE</span><div>{primitives.map(p=><PrimitiveLink key={p.id} id={p.id}/>)}</div></div> }

const roles=['Software Engineer','Senior Engineer / Tech Lead','Founder / CTO','Product','Other']
export function WaitlistForm() {
 const [state,setState]=useState<'idle'|'loading'|'success'|'error'>('idle'); const [message,setMessage]=useState('')
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setState('loading');setMessage('');const data=new FormData(e.currentTarget);const url=import.meta.env.VITE_SUPABASE_URL;const key=import.meta.env.VITE_SUPABASE_ANON_KEY;if(!url||!key){setState('error');setMessage('Waitlist configuration is not available yet. Please try again later.');return}const {error}=await createClient(url,key).from('waitlist').insert({email:data.get('email'),name:data.get('name'),role:data.get('role')});if(error){setState('error');setMessage(error.code==='23505'?'That email is already on the list.':'Something went wrong. Please try again.')}else setState('success')}
 if(state==='success')return <div className="success-state"><span><Check/></span><h2>You're on the list.</h2><p>We'll keep you posted.</p></div>
 return <form className="waitlist-form" onSubmit={submit}><label>Name<input name="name" autoComplete="name" required placeholder="Ada Lovelace"/></label><label>Email<input type="email" name="email" autoComplete="email" required placeholder="ada@example.com"/></label><label>Role<select name="role" required defaultValue=""><option value="" disabled>Select your role</option>{roles.map(r=><option key={r}>{r}</option>)}</select></label><button className="button" disabled={state==='loading'}>{state==='loading'?'Joining…':'Join the waitlist'} <ArrowRight size={16}/></button>{state==='error'&&<p className="form-error" role="alert">{message}</p>}<p className="form-note">No spam. Just product updates and early access.</p></form>
}

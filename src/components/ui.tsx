import { Children, isValidElement, useEffect, useId, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowRight, Check, ChevronDown, FileCode2, Menu, X } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { primitiveById, primitives, type Approach, type Problem, type Primitive, type PrimitiveId } from '../content/data'

export function Header() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  return <header className="header" onKeyDown={event=>{if(event.key==='Escape'&&open){setOpen(false);menuButton.current?.focus()}}}><div className="nav-wrap"><Link className="brand" to="/" aria-label="T/AI home" onClick={()=>setOpen(false)}><span className="brand-mark">T<span>/</span>AI<span className="brand-square"/></span><span className="brand-caption">THINK LIKE AN<br/>AI ENGINEER</span></Link><button ref={menuButton} className="menu-button" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="main-navigation" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button><nav id="main-navigation" className={open?'nav open':'nav'}><NavLink to="/problems" onClick={()=>setOpen(false)}>The course</NavLink><NavLink to="/primitives" onClick={()=>setOpen(false)}>AI building blocks</NavLink><Link className="nav-updates" to="/waitlist" onClick={()=>setOpen(false)}>Get updates</Link><Link className="button small" to="/problems/classify-support-tickets" onClick={()=>setOpen(false)}>Start learning <ArrowRight size={15}/></Link></nav></div></header>
}

export function Footer() { return <footer><div className="footer-inner"><div><Link className="brand" to="/"><span className="brand-mark">T<span>/</span>AI<span className="brand-square"/></span><span className="brand-caption">THINK LIKE AN<br/>AI ENGINEER</span></Link><p>Less AI hype. More engineering intuition.</p></div><div className="footer-links"><Link to="/problems">The course</Link><Link to="/primitives">Building blocks</Link><Link to="/waitlist">Get updates <ArrowRight size={14}/></Link></div></div><div className="footer-bottom"><span>Built for the people who build software.</span><span>Think in systems. Build with AI.</span></div></footer> }

export function Page({children}: {children: ReactNode}) {
  const { pathname } = useLocation()
  const main = useRef<HTMLElement>(null)
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); main.current?.focus({preventScroll:true}) }, [pathname])
  return <><a className="skip-link" href="#main-content">Skip to content</a><Header/><main ref={main} id="main-content" tabIndex={-1}>{children}</main><Footer/></>
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
  return <span className="primitive-name" style={primitiveStyle(primitive)}>{primitive.id}()</span>
}

export function PrimitiveLink({id, children, inline=false}: {id: PrimitiveId; children?: ReactNode; inline?: boolean}) {
  const primitive = primitiveById(id)!
  return <Link className={inline?'primitive-call':'primitive-badge'} to={`/primitives/${id}`} style={primitiveStyle(primitive)} data-primitive={id} data-tooltip={primitive.short} title={primitive.short} aria-label={`${primitive.name} — learn this AI building block`}>{children ?? `${primitive.id}()`}</Link>
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

export function PseudoCode({code, label='solution.ts', compact=false}: {code: string; label?: string; compact?: boolean}) {
  const [copied, setCopied] = useState(false)
  const [failed, setFailed] = useState(false)
  useEffect(()=>{setCopied(false);setFailed(false)},[code])
  useEffect(()=>{if(!copied) return;const timer=window.setTimeout(()=>setCopied(false),2000);return ()=>window.clearTimeout(timer)},[copied])
  async function copy() {
    try { await navigator.clipboard.writeText(code); setCopied(true); setFailed(false) }
    catch { setFailed(true) }
  }
  return <div className={`pseudo-code ${compact?'compact':''}`}><div className="code-toolbar"><span><FileCode2 size={15}/>{label}</span><button onClick={copy} aria-label="Copy pseudo-code">{copied?<Check size={14}/>:null}{copied?'Copied':'Copy code'}</button></div><pre tabIndex={0} aria-label="TypeScript-like pseudo-code"><code>{codeTokens(code)}</code></pre><div className="code-footer"><span className="code-color-dot"/><span>Colored functions are linked building blocks. Everything else is ordinary code.</span><span className="sr-only" role="status">{copied?'Code copied to clipboard.':failed?'Copy unavailable. Select the code to copy it manually.':''}</span></div>{failed&&<p className="copy-error">Select the code to copy it manually; clipboard access is unavailable.</p>}</div>
}

export function ProblemCard({problem}: {problem: Problem}) { return <Link to={`/problems/${problem.slug}`} className="problem-card"><div className="card-meta"><span>{problem.category}</span><span>{problem.difficulty}</span></div><h3>{problem.title}</h3><p>{problem.description}</p><div className="problem-functions">{[...new Set(problem.approaches.flatMap(a=>a.primitives))].slice(0,4).map(id=><PrimitiveName key={id} id={id}/>)}</div><div className="card-footer"><span>{problem.approaches.length} approaches</span><ArrowRight size={17}/></div></Link> }
export function ProblemList({problems}: {problems: Problem[]}) { return <div className="problem-grid">{problems.map(p=><ProblemCard key={p.slug} problem={p}/>)}</div> }

export function PrimitiveDiagram({primitive}: {primitive: Primitive}) { return <div className="function-diagram" style={primitiveStyle(primitive)}><div><span>INPUT</span><code>{primitive.input}</code></div><ArrowRight aria-hidden="true"/><strong>{primitive.id}()</strong><ArrowRight aria-hidden="true"/><div><span>OUTPUT</span><code>{primitive.output}</code></div></div> }
export function PrimitiveCard({primitive}: {primitive: Primitive}) { return <Link to={`/primitives/${primitive.id}`} className="function-card" style={primitiveStyle(primitive)}><div className="function-card-top"><span className="function-swatch"/><span>{primitive.capability}</span><ArrowRight size={16}/></div><h3>{primitive.id}()</h3><p>{primitive.short}</p><div className="function-card-return"><span>RETURNS</span><code>{primitive.output}</code></div></Link> }

function Diagram({code}: {code: string}) {
  const id = useId().replace(/:/g, '')
  const container = useRef<HTMLDivElement>(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    let cancelled = false
    setError(false)
    import('mermaid').then(async ({default: mermaid}) => {
      mermaid.initialize({startOnLoad: false, securityLevel: 'strict', theme: 'neutral'})
      const {svg} = await mermaid.render(`diagram-${id}`, code)
      if (!cancelled && container.current) container.current.innerHTML = svg
    }).catch(() => { if (!cancelled) setError(true) })
    return () => { cancelled = true }
  }, [code, id])
  return error ? <PseudoCode code={code} label="DIAGRAM SOURCE"/> : <div ref={container} className="markdown-diagram" role="img" aria-label="Approach diagram"/>
}

export function MarkdownContent({body}: {body: string}) {
  return <div className="approach-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{
    pre({children}) {
      const child = Children.toArray(children)[0]
      if (!isValidElement<{children?: ReactNode; className?: string}>(child)) return <pre>{children}</pre>
      const code = Children.toArray(child.props.children).join('').replace(/\n$/, '')
      return child.props.className === 'language-mermaid' ? <Diagram code={code}/> : <PseudoCode code={code}/>
    },
    code({children}) {
      const text = String(children)
      const primitive = primitives.find(p => text === p.id || text === `${p.id}()` || text === p.name)
      return primitive ? <PrimitiveLink id={primitive.id} inline>{text}</PrimitiveLink> : <code>{children}</code>
    },
    a({href, children}) {
      return href?.startsWith('/') && !href.startsWith('//') ? <Link to={href}>{children}</Link> : <a href={href} rel="noopener noreferrer">{children}</a>
    },
    table({children}) { return <div className="markdown-table"><table>{children}</table></div> },
  }}>{body}</ReactMarkdown></div>
}

export function ApproachSection({number,title,summary,body,primitives:ids}: Approach & {number:number}) {
  const [open,setOpen]=useState(number===1)
  const id = useId()
  return <section className={`approach ${open?'expanded':''}`}><button className="approach-head" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls={id}><span className="approach-number">{String(number).padStart(2, '0')}</span><span><strong>{title}</strong><small>{summary}</small></span><ChevronDown/></button>{open&&<div className="approach-body code-approach" id={id}><div className="approach-functions">{ids.length?ids.map(primitive=><PrimitiveLink key={primitive} id={primitive}/>):<span className="no-ai-label"><Check size={14}/>No AI needed. That’s a valid design.</span>}</div><MarkdownContent body={body}/></div>}</section>
}

export function FunctionLegend() { return <div className="function-legend"><span>SMALL FUNCTIONS. USEFUL MENTAL MODELS.</span><div>{primitives.map(p=><PrimitiveLink key={p.id} id={p.id}/>)}</div></div> }

const roles=['Software Engineer','Senior Engineer / Tech Lead','Founder / CTO','Product','Other']
export function WaitlistForm() {
 const [state,setState]=useState<'idle'|'loading'|'success'|'error'>('idle'); const [message,setMessage]=useState('')
 async function submit(e:FormEvent<HTMLFormElement>) {
  e.preventDefault();setState('loading');setMessage('')
  const data=new FormData(e.currentTarget)
  const url=import.meta.env.VITE_SUPABASE_URL
  const key=import.meta.env.VITE_SUPABASE_ANON_KEY
  if(!url||!key){setState('error');setMessage('Updates signup is not available yet. You can still explore the entire course.');return}
  try {
   const {createClient}=await import('@supabase/supabase-js')
   const {error}=await createClient(url,key).from('waitlist').insert({email:data.get('email'),name:data.get('name'),role:data.get('role')})
   if(error){setState('error');setMessage(error.code==='23505'?'That email is already on the list.':'Something went wrong. Please try again.')}else setState('success')
  } catch {setState('error');setMessage('Could not connect. Please try again when you’re online.')}
 }
 if(state==='success')return <div className="success-state" role="status"><span><Check/></span><h2>You're on the list.</h2><p>We'll keep you posted. Your next mental model is waiting.</p><Link className="button" to="/problems">Explore the course <ArrowRight size={16}/></Link></div>
 return <form className="waitlist-form" onSubmit={submit}><label>Name<input name="name" autoComplete="name" required placeholder="Ada Lovelace"/></label><label>Email<input type="email" name="email" autoComplete="email" required placeholder="ada@example.com"/></label><label>Role<select name="role" required defaultValue=""><option value="" disabled>Select your role</option>{roles.map(r=><option key={r}>{r}</option>)}</select></label><button className="button" disabled={state==='loading'}>{state==='loading'?'Joining…':'Send me updates'} <ArrowRight size={16}/></button>{state==='error'&&<p className="form-error" role="alert">{message}</p>}<p className="form-note">Optional updates. The course is already open.</p></form>
}

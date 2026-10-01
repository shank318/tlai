import { useEffect, useState, type CSSProperties } from 'react'
import { ArrowDown, ArrowDownRight, ArrowRight, Asterisk, BookOpen, Braces, Check, ChevronDown, ChevronLeft, ChevronRight, Code2, Database, GitBranch, Layers, Pause, Play, Workflow } from 'lucide-react'
import { Link, Navigate, NavLink, useParams, useSearchParams } from 'react-router-dom'
import { MarkdownContent, FunctionLegend, Page, PrimitiveCard, PrimitiveDiagram, PrimitiveLink, PrimitiveName, PseudoCode, SEO, WaitlistForm } from '../components/ui'
import { primitiveAliases, primitiveById, primitives, problemAliases, problemBySlug, problemSummaries, problems, type Difficulty, type PrimitiveId, type Problem, type ProblemSummary } from '../content/data'

const examples: {title: string; slug: string; label: string; code: string; ids: PrimitiveId[]; action: string; insight: string}[] = [
  {
    title: 'How would you route 100K support tickets?', slug: 'classify-support-tickets', label: '01 / ROUTE TICKETS', ids: ['askDecisionModel'],
    code: '// Classify each ticket with a structured choice\nconst category = askDecisionModel(\n  ticket.text,\n  "What type of ticket is this?",\n  ["billing", "technical", "account", "other"]\n)\n\n// Normal software handles the routing\nif (category === "other") {\n  queueForReview(ticket)\n} else {\n  route(ticket, category)\n}',
    action: 'Route the ticket. Or send it to a review queue.', insight: 'AI understands the words. Your code owns the action.',
  },
  {
    title: 'How would you summarize a huge document?', slug: 'summarize-documents', label: '02 / SUMMARIZE DOCUMENTS', ids: ['askCheapLLM', 'askSmartLLM'],
    code: '// Break the document into manageable chunks\nconst chunks = splitIntoSections(document)\nconst summaries = []\n\nfor (const chunk of chunks) {\n  // A smaller model summarizes each section\n  const prompt = "Summarize this section: " + chunk\n  const summary = askCheapLLM(prompt)\n  summaries.push(summary)\n}\n\n// A stronger model connects the parts\nconst finalPrompt = "Combine these summaries: " + summaries\nconst finalSummary = askSmartLLM(finalPrompt)\nsave(finalSummary)',
    action: 'Save a summary. Keep the original for verification.', insight: 'Same loop you already know. Two different reasoning budgets.',
  },
  {
    title: 'How would you search documents by meaning?', slug: 'search-documents', label: '03 / SEARCH BY MEANING', ids: ['embed', 'askSmartLLM'],
    code: '// Split documents into short sections\nconst chunks = splitIntoSections(document)\nfor (const chunk of chunks) {\n  const vector = embed(chunk.text)\n  // Save the text, vector, and access permissions\n  saveChunk(chunk, vector)\n}\n\nconst questionVector = embed(question)\n// Read saved chunks this user is allowed to see\nconst savedChunks = loadDocumentChunks(user)\n// Compare vectors to find the closest passages\nconst sources = findSimilar(questionVector, savedChunks)\n\n// Ask for an answer grounded in the sources\nconst prompt = "Answer with citations: " + question + sources\nconst answer = askSmartLLM(prompt)\nshowWithSources(answer, sources)',
    action: 'Show the answer alongside the original sources.', insight: 'The AI makes vectors and text. Your index does the searching.',
  },
]

export function HomePage() {
  return <Page><SEO title="Normal code. A few AI building blocks." description="A tiny teaching pseudo-language that helps software engineers visualize AI inside normal programs. Explore real problems and different engineering approaches."/><div className="landing">
    <section className="landing-hero landing-shell learning-hero">
      <div className="hero-kicker"><span className="live-dot"/> LEARN TO APPLY AI TO REAL SOFTWARE PROBLEMS</div>
      <div className="landing-hero-heading"><h1>Normal code.<br/><span>A little more possibility.</span><Asterisk className="heading-asterisk" aria-hidden="true"/></h1></div>
      <div className="concept-intro"><div><h2>What are these functions?</h2><p>We created a tiny pseudo-language for AI so software engineers can visualize AI as building blocks inside normal programs.</p><p className="teaching-note">These are teaching primitives, not an SDK.</p></div><Link className="landing-button" to="/problems/classify-support-tickets">Explore a real problem <ArrowRight size={17}/></Link></div>
      <ExampleWorkbench/>
      <div className="hero-footnote"><span><Code2 size={14}/> THE CODE IS THE EXPLANATION.</span><span>NO PACKAGE TO INSTALL. NO NEW FRAMEWORK. <ArrowDownRight size={14}/></span></div>
    </section>
    <section className="toolbox-section" id="toolbox"><div className="landing-shell"><div className="section-topline"><span className="mono-label">THE MENTAL MODEL</span><span className="mono-label muted">SAME ENGINEERING. NEW POSSIBILITIES.</span></div><div className="toolbox-heading"><h2>AI is part of the program.<br/><span>Not the whole system.</span></h2><p>Variables, loops, databases, queues.<br/>Add AI only where meaning or reasoning helps.<br/>Keep the rest in ordinary code.</p></div><div className="mental-equation"><div className="ordinary-blocks"><span className="mono-label">NORMAL SOFTWARE ENGINEERING</span><div><span><Braces size={18}/>APIs</span><span><Database size={18}/>Databases</span><span><Workflow size={18}/>Queues</span><span><GitBranch size={18}/>Logic</span></div></div><span className="equation-plus">+</span><div><span className="mono-label">FOUR AI BUILDING BLOCKS</span><div className="equation-primitives">{primitives.map(p=><PrimitiveLink id={p.id} key={p.id}/>)}</div></div></div><div className="equation-result"><ArrowDown size={18}/><strong>AI-enabled software</strong><span>Still designed, tested, and owned by you.</span></div></div></section>
    <section className="problem-section landing-shell"><div className="section-topline"><span className="mono-label">A PROBLEM-SOLVING FIELD GUIDE</span><span className="mono-label muted">{problems.length} PROBLEMS / MULTIPLE APPROACHES</span></div><div className="problem-section-heading"><h2>Build intuition.<br/>One problem at a time.</h2><Link className="landing-secondary" to="/problems">Open the workspace <ArrowRight size={16}/></Link></div><div className="home-curriculum">{(['Simple','Medium','Hard'] as Difficulty[]).map((difficulty,i)=><div key={difficulty}><span className={`difficulty ${difficulty.toLowerCase()}`}>{difficulty}</span><h3>{['Spot where AI fits.','Connect the building blocks.','Keep complex systems under control.'][i]}</h3>{problems.filter(p=>p.difficulty===difficulty).slice(0,3).map(p=><Link key={p.slug} to={`/problems/${p.slug}`}><span>{p.title}</span><ChevronRight size={16}/></Link>)}</div>)}</div></section>
    <section className="method-section"><div className="landing-shell"><div className="section-topline"><span className="mono-label">THE LEARNING LOOP</span><BookOpen size={18}/></div><div className="method-grid"><div className="method-intro"><h2>Not tool tutorials.<br/><span>Engineering choices.</span></h2><p>No transformer internals to memorize.<br/>No SDK syntax to learn.<br/>Just real problems and different ways to build.</p><Link className="landing-secondary" to="/problems">Start thinking in programs <ArrowRight size={16}/></Link></div><div className="method-steps">{[['Think before you look.','Sketch the parts ordinary code can solve. Notice where the input is ambiguous.'],['Explore different approaches.','Scan the pseudo-code. Compare constraints, costs, and trade-offs—not best and worst.'],['Follow the colored calls.','Open a primitive, learn the idea, then bring it back to the problem.']].map(([title,text],i)=><article className="method-step" key={title}><span className="method-number">0{i+1}</span><div><h3>{title}</h3><p>{text}</p></div><ChevronRight size={17}/></article>)}</div></div></div></section>
  </div></Page>
}

function ExampleWorkbench() {
  const [selected, setSelected] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (!playing || hovered || focused || reducedMotion) return
    const timer = window.setInterval(() => {
      if (!document.hidden) setSelected(current => (current + 1) % examples.length)
    }, 12000)
    return () => window.clearInterval(timer)
  }, [playing, hovered, focused, reducedMotion, selected])
  const example = examples[selected]
  return <div className="workbench example-workbench" onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} onFocusCapture={()=>setFocused(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node)) setFocused(false)}}>
    <div className="example-toolbar"><span className="mono-label"><span className="live-dot"/> SEE THE IDEA IN CODE</span><button onClick={()=>{setPlaying(!playing); if(reducedMotion) setReducedMotion(false)}} aria-label={playing&&!reducedMotion?'Pause changing examples':'Play changing examples'}>{playing&&!reducedMotion?<Pause size={14}/>:<Play size={14}/>} {playing&&!reducedMotion?'Pause':'Play'}</button></div>
    <div className="example-tabs" role="group" aria-label="Choose a real-world example">{examples.map((item,i)=><button key={item.slug} aria-pressed={selected===i} onClick={()=>{setSelected(i);setPlaying(false)}}>{item.label}</button>)}</div>
    <div className="example-program" key={example.slug}><div className="example-context"><span className="mono-label">01 / REAL PROBLEM</span><h3>{example.title}</h3><ArrowDown size={20}/><span className="mono-label">02 / PSEUDO-CODE</span><p>{example.insight}</p><Link to={`/problems/${example.slug}`}>Explore the approaches <ArrowRight size={16}/></Link></div><PseudoCode code={example.code} label="NORMAL CODE + AI"/></div>
    <div className="example-outcome"><div><span className="mono-label">03 / AI PRIMITIVES</span><div>{example.ids.map(id=><PrimitiveLink key={id} id={id}/>)}</div></div><ArrowRight className="outcome-arrow" size={21}/><div><span className="mono-label">04 / SOFTWARE ACTION</span><p>{example.action}</p></div></div>
  </div>
}

const difficulties: Difficulty[] = ['Simple', 'Medium', 'Hard']

export function ProblemsPage() {
  const {slug} = useParams()
  const [params, setParams] = useSearchParams()
  if (slug && Object.prototype.hasOwnProperty.call(problemAliases, slug)) return <Navigate to={`/problems/${problemAliases[slug]}?${params}`} replace/>
  const problem = problemBySlug(slug ?? problemSummaries[0]?.slug ?? '')
  if (!problem) return <NotFoundPage/>
  const difficulty = difficulties.find(value => value === params.get('difficulty')) ?? 'All'
  const visible = problemSummaries.filter(item => difficulty === 'All' || item.difficulty === difficulty)
  const query = difficulty === 'All' ? '' : `?difficulty=${difficulty}`
  const index = visible.findIndex(item => item.slug === problem.slug)
  const requestedApproach = Number(params.get('approach') ?? 1) - 1
  const approachIndex = Number.isInteger(requestedApproach) && problem.approaches[requestedApproach] ? requestedApproach : 0
  function selectDifficulty(value: string) {
    const next = new URLSearchParams()
    if (value !== 'All') next.set('difficulty',value)
    if (approachIndex > 0) next.set('approach',String(approachIndex + 1))
    setParams(next, {replace:true})
  }
  function selectApproach(value: number) {
    const next = new URLSearchParams()
    if (difficulty !== 'All') next.set('difficulty',difficulty)
    if (value > 0) next.set('approach',String(value + 1))
    setParams(next, {replace:true})
  }
  return <Page><SEO title={problem.title} description={problem.description}/><div className="problem-layout">
    <ProblemNavigator items={visible} selectedSlug={problem.slug} selectedTitle={problem.title} difficulty={difficulty} onDifficultyChange={selectDifficulty} query={query}/>
    <ProblemReader problem={problem} approachIndex={approachIndex} onApproachChange={selectApproach} previous={visible[index - 1]} next={visible[index + 1]} query={query}/>
  </div></Page>
}

function ProblemNavigator({items,selectedSlug,selectedTitle,difficulty,onDifficultyChange,query}: {items: ProblemSummary[]; selectedSlug: string; selectedTitle: string; difficulty: string; onDifficultyChange: (value: string)=>void; query: string}) {
  const [open,setOpen] = useState(false)
  return <aside className={`problem-rail ${open?'is-open':''}`}>
    <div className="rail-heading"><BookOpen size={18}/><h2>Problems</h2></div>
    <p className="rail-caption">Real questions. Different approaches.</p>
    <button className="mobile-problem-picker" aria-expanded={open} aria-controls="problem-directory" onClick={()=>setOpen(!open)}><span><small>BROWSE PROBLEMS</small>{selectedTitle}</span><ChevronDown size={18}/></button>
    <div id="problem-directory" className="problem-directory"><div className="rail-filters" role="group" aria-label="Filter by difficulty">{['All',...difficulties].map(value=><button key={value} aria-pressed={difficulty===value} onClick={()=>onDifficultyChange(value)}>{value}</button>)}</div>
      <nav className="problem-directory-list" aria-label="Problem list">{difficulties.map(level=>{const group=items.filter(item=>item.difficulty===level);return group.length>0&&<section className="directory-group" key={level}><h3><span className={`level-dot ${level.toLowerCase()}`}/>{level}</h3>{group.map(item=><Link to={`/problems/${item.slug}${query}`} key={item.slug} aria-current={item.slug===selectedSlug?'page':undefined} onClick={()=>setOpen(false)}><span>{item.title}</span><ChevronRight size={14}/></Link>)}</section>})}{items.length===0&&<p className="directory-empty">No problems at this level yet.</p>}</nav>
    </div>
    <Link className="rail-reference" to="/primitives"><Layers size={16}/><span>The four AI primitives</span><ArrowRight size={14}/></Link>
  </aside>
}

function ProblemReader({problem,approachIndex,onApproachChange,previous,next,query}: {problem: Problem; approachIndex: number; onApproachChange: (index: number)=>void; previous?: ProblemSummary; next?: ProblemSummary; query: string}) {
  const approach = problem.approaches[approachIndex]
  return <article className="problem-reader">
    <header className="reader-header"><div className="reader-meta"><span className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span><span>{problem.category}</span></div><h1>{problem.question}</h1><p>{problem.description}</p></header>
    <section className="reader-approaches" aria-label="Possible approaches"><div className="reader-section-heading"><h2>Ways to solve it</h2><span>{problem.approaches.length} approaches · different trade-offs</span></div>
      <div className="approach-tabs" role="tablist" aria-label="Choose an approach">{problem.approaches.map((item,i)=><button key={item.title} id={`approach-tab-${i}`} role="tab" aria-selected={approachIndex===i} aria-controls="approach-panel" tabIndex={approachIndex===i?0:-1} onClick={()=>onApproachChange(i)} onKeyDown={event=>{
        const last = problem.approaches.length - 1
        const target = event.key==='ArrowRight'?(i+1)%(last+1):event.key==='ArrowLeft'?(i+last)%(last+1):event.key==='Home'?0:event.key==='End'?last:undefined
        if (target===undefined) return
        event.preventDefault()
        onApproachChange(target)
        document.getElementById(`approach-tab-${target}`)?.focus()
      }}><span>0{i+1}</span>{item.title}</button>)}</div>
      <div id="approach-panel" className="approach-panel" role="tabpanel" aria-labelledby={`approach-tab-${approachIndex}`} tabIndex={0}><div className="reader-approach-heading"><div><h3>{approach.title}</h3><p>{approach.summary}</p></div><div className="reader-primitive-links">{approach.primitives.length?approach.primitives.map(id=><PrimitiveLink key={id} id={id}/>):<span className="ordinary-code-label"><Braces size={15}/>Ordinary code only</span>}</div></div><MarkdownContent key={`${problem.slug}-${approachIndex}`} body={approach.body}/></div>
    </section>
    <p className="reader-note"><Code2 size={15}/>Teaching pseudo-code, not an SDK. Colored calls are AI; everything else is ordinary software.</p>
    <nav className="reader-pagination" aria-label="Previous and next problem">{previous?<Link to={`/problems/${previous.slug}${query}`}><ChevronLeft size={17}/><span><small>PREVIOUS</small>{previous.title}</span></Link>:<span/>}{next&&<Link to={`/problems/${next.slug}${query}`}><span><small>NEXT PROBLEM</small>{next.title}</span><ChevronRight size={17}/></Link>}</nav>
  </article>
}

export function PrimitivesPage() {
  return <Page><SEO title="Four teaching primitives" description="Understand askCheapLLM, askSmartLLM, askDecisionModel, and embed. Teaching abstractions for visualizing AI inside ordinary software—not an SDK."/><section className="page-hero shell function-library-hero"><div className="eyebrow">THE TEACHING VOCABULARY / 04</div><h1>Four building blocks.<br/><em>Your code connects them.</em></h1><p>These are teaching primitives, not an SDK. We gave common AI capabilities simple names so you can see where AI fits without learning a provider’s API.</p></section><section className="shell function-library"><FunctionLegend/><div className="function-grid">{primitives.map(p=><PrimitiveCard key={p.id} primitive={p}/>)}</div><div className="composition-example"><div><div className="eyebrow">AI + ORDINARY SOFTWARE</div><h2>Find evidence.<br/>Then answer.</h2><p>The embedding model creates a vector. Your index finds sources. A stronger LLM writes the answer. No special search or RAG primitive needed.</p></div><PseudoCode code={'// Assume document chunks and their vectors were saved earlier\nconst questionVector = embed(question)\n// Read saved text and vectors; check this user can see each document\nconst chunks = loadDocumentChunks(user)\n// Compare vectors and return the passages closest to the question\nconst sources = findSimilar(questionVector, chunks)\n\n// Include the evidence in one prompt\nconst prompt = "Answer from these sources with citations: "\n  + question + sources\nconst answer = askSmartLLM(prompt)\n\n// Normal software presents the result\nshowWithSources(answer, sources)'}/></div></section></Page>
}

export function PrimitiveDetailPage() {
  const {id} = useParams()
  if (id && Object.prototype.hasOwnProperty.call(primitiveAliases,id)) return <Navigate to={`/primitives/${primitiveAliases[id]}`} replace/>
  const primitive = primitiveById(id??'')
  if (!primitive) return <NotFoundPage/>
  const related = problems.filter(p=>p.approaches.some(a=>a.primitives.includes(primitive.id)))
  return <Page><SEO title={primitive.name} description={primitive.short}/><article className="shell function-doc"><aside className="function-sidebar"><Link className="back-link" to="/primitives">← All primitives</Link><span className="eyebrow">TEACHING PRIMITIVES</span><nav aria-label="AI primitives">{primitives.map(p=><NavLink key={p.id} to={`/primitives/${p.id}`}><PrimitiveName id={p.id}/></NavLink>)}</nav><p>These are teaching primitives,<br/>not an SDK.</p><Link className="back-to-problems" to="/problems">Back to problems <ArrowRight size={14}/></Link></aside><div className="function-doc-body"><header className="function-doc-header" style={{'--primitive-color':primitive.color, '--primitive-tint':primitive.tint} as CSSProperties}><div className="eyebrow">{primitive.capability}</div><h1>{primitive.name}</h1><p>{primitive.short}</p></header><div className="pseudo-disclaimer"><Code2 size={17}/><p>These are teaching primitives, not an SDK. The names describe ideas—not APIs you can import.</p></div><PrimitiveDiagram primitive={primitive}/><section className="function-model"><div className="eyebrow">WHAT IT REPRESENTS</div><p>{primitive.mentalModel}</p></section><PseudoCode code={primitive.exampleCode} label="A TINY EXAMPLE"/><section className="function-model"><div className="eyebrow">WHAT ROUGHLY HAPPENS UNDERNEATH</div><p>{primitive.underneath}</p></section><div className="function-use-grid"><section><h2><Check size={18}/>When to use it</h2><ul>{primitive.useful.map(item=><li key={item}>{item}</li>)}</ul></section><section><h2>When ordinary code is a better fit</h2><ul>{primitive.notUseful.map(item=><li key={item}>{item}</li>)}</ul></section></div><aside className="function-caution"><span>WHAT YOUR SOFTWARE STILL OWNS</span><p>{primitive.caution}</p></aside><section className="function-providers"><span className="eyebrow">TO MAKE IT CONCRETE</span><h2>A few example providers / models</h2><ul>{primitive.providers.map(item=><li key={item}>{item}</li>)}</ul><p>Examples, not recommendations or comparisons. Choose and test the implementation for your own workload.</p></section><section className="function-related"><span className="eyebrow">BRING THE IDEA BACK TO A PROBLEM</span><h2>See it inside real software.</h2><div className="related-problem-list">{related.map(p=><Link to={`/problems/${p.slug}`} key={p.slug}><span>{p.title}</span><span className={`difficulty ${p.difficulty.toLowerCase()}`}>{p.difficulty}</span><ArrowRight size={16}/></Link>)}</div></section></div></article></Page>
}

export function WaitlistPage(){return <Page><SEO title="Join the waitlist" description="Get early access to Think Like an AI Engineer."/><section className="waitlist-page shell"><div className="waitlist-copy"><div className="eyebrow">STAY IN THE LOOP</div><h1>Learn what to build.<br/><em>And what not to.</em></h1><p>A practical field guide for software engineers working out where AI actually belongs.</p><ul><li><Check/>New problem breakdowns</li><li><Check/>Code-first AI primitive explainers</li><li><Check/>Product updates</li></ul></div><div className="form-card"><WaitlistForm/></div></section></Page>}
export function NotFoundPage(){return <Page><SEO title="Page not found" description="This page does not exist. Explore the AI engineering problems or teaching primitives."/><section className="not-found shell"><span>404</span><h1>Nothing at this route.</h1><Link className="button" to="/problems">Explore problems <ArrowRight size={16}/></Link></section></Page>}

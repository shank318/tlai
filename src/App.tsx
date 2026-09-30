import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage, NotFoundPage, PrimitiveDetailPage, PrimitivesPage, ProblemDetailPage, ProblemsPage, WaitlistPage } from './pages/pages'

export default function App(){return <BrowserRouter><Routes><Route path="/" element={<HomePage/>}/><Route path="/problems" element={<ProblemsPage/>}/><Route path="/problems/:slug" element={<ProblemDetailPage/>}/><Route path="/primitives" element={<PrimitivesPage/>}/><Route path="/primitives/:id" element={<PrimitiveDetailPage/>}/><Route path="/waitlist" element={<WaitlistPage/>}/><Route path="*" element={<NotFoundPage/>}/></Routes></BrowserRouter>}

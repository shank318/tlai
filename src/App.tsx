import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage, NotFoundPage, PrimitiveDetailPage, PrimitivesPage, ProblemsPage, WaitlistPage } from './pages/pages'

export default function App(){return <BrowserRouter><Routes><Route path="/" element={<HomePage/>}/><Route path="/problems/:slug?" element={<ProblemsPage/>}/><Route path="/primitives" element={<PrimitivesPage/>}/><Route path="/primitives/:id" element={<PrimitiveDetailPage/>}/><Route path="/waitlist" element={<WaitlistPage/>}/><Route path="*" element={<NotFoundPage/>}/></Routes></BrowserRouter>}

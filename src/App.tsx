import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import './profile.css'
import {
  Activity, ArrowDownRight, ArrowRight, Bell, BookOpen, BrainCircuit, Check,
  CheckCheck, ChevronDown, ChevronRight, CircleDot, Code2,
  Copy, File, FileCode2, FileText, Filter, Folder, GitBranch, GitCommitHorizontal,
  GitMerge, GitPullRequest, LayoutDashboard, Menu, MoreHorizontal, Plus,
  Search, Settings2, ShieldCheck, Sparkles, Terminal, X,
} from 'lucide-react'

type View = 'overview' | 'code' | 'issues' | 'pulls' | 'insights'
type IssueStatus = 'analyzing' | 'pr-ready' | 'merged'
type Issue = { id: number; title: string; description: string; label: string; status: IssueStatus; created: string }

type FileItem = { name: string; kind: 'folder' | 'file'; detail: string; time: string; summary: string }

const initialIssues: Issue[] = [
  { id: 42, title: 'Session expires after page refresh', description: 'Users are signed out when refreshing a protected route. The auth state should restore from the existing session token.', label: 'bug', status: 'pr-ready', created: '2 hours ago' },
  { id: 41, title: 'Add keyboard navigation to search results', description: 'Allow arrow keys and Enter to move through and open search results.', label: 'enhancement', status: 'analyzing', created: '5 hours ago' },
  { id: 40, title: 'Update setup guide for local development', description: 'Document the local environment variables and first-run steps.', label: 'documentation', status: 'merged', created: 'Yesterday' },
]

const files: FileItem[] = [
  { name: 'src', kind: 'folder', detail: 'Refactor auth middleware', time: '2 hours ago', summary: 'Application source: routes, components, authentication, and shared utilities.' },
  { name: 'public', kind: 'folder', detail: 'Update app icon', time: '3 days ago', summary: 'Static assets served directly by the application.' },
  { name: 'tests', kind: 'folder', detail: 'Add session unit tests', time: '2 hours ago', summary: 'Unit and integration coverage for core application behavior.' },
  { name: '.env.example', kind: 'file', detail: 'Document environment variables', time: 'Yesterday', summary: 'Template for environment configuration used by local development.' },
  { name: 'package.json', kind: 'file', detail: 'Update dependencies', time: '3 days ago', summary: 'Project scripts, dependencies, and package metadata.' },
  { name: 'README.md', kind: 'file', detail: 'Update setup guide', time: 'Yesterday', summary: 'Getting started instructions and contributor notes.' },
]

const srcFiles: FileItem[] = [
  { name: 'components', kind: 'folder', detail: 'Polish navigation', time: '3 days ago', summary: 'Reusable user interface components.' },
  { name: 'hooks', kind: 'folder', detail: 'Refactor auth middleware', time: '2 hours ago', summary: 'React hooks for authentication and application state.' },
  { name: 'lib', kind: 'folder', detail: 'Improve API client', time: '4 days ago', summary: 'Shared helpers and API communication.' },
  { name: 'App.tsx', kind: 'file', detail: 'Polish navigation', time: '3 days ago', summary: 'Application routes and top-level layout.' },
  { name: 'main.tsx', kind: 'file', detail: 'Initial app setup', time: '2 weeks ago', summary: 'Application entry point and provider setup.' },
]

type Repository = { id: string; name: string; description: string; readme: string; tags: string[]; files: FileItem[]; srcFiles: FileItem[]; issues: Issue[]; fileCount: number; coverage: number }
const sampleFile = (name: string, kind: FileItem['kind'], summary: string): FileItem => ({ name, kind, detail: 'Update project files', time: 'Yesterday', summary })
const repositories: Repository[] = [
  { id: 'orbit-ui', name: 'Argon / sample-repo-v1', description: 'A modern component library for ambitious teams.', readme: 'Build consistent, accessible interfaces with composable primitives and a thoughtful design system.', tags: ['React', 'TypeScript', 'Accessible'], files, srcFiles, issues: initialIssues, fileCount: 128, coverage: 94 },
  { id: 'atlas-api', name: 'Argon / test-repo-v1', description: 'A dependable API for maps and places.', readme: 'Atlas API serves location search, geocoding, and place data with a small, well documented HTTP interface.', tags: ['Node.js', 'TypeScript', 'REST API'], files: [sampleFile('src', 'folder', 'Routes, handlers, and service logic.'), sampleFile('tests', 'folder', 'API and integration tests.'), sampleFile('openapi.yaml', 'file', 'OpenAPI contract for all endpoints.'), sampleFile('package.json', 'file', 'Project scripts and dependencies.'), sampleFile('README.md', 'file', 'Setup and API usage.')], srcFiles: [sampleFile('routes', 'folder', 'HTTP route definitions.'), sampleFile('services', 'folder', 'Place search and geocoding services.'), sampleFile('server.ts', 'file', 'API server entry point.')], issues: [{ id: 12, title: 'Return clear errors for invalid coordinates', description: 'Reject out of range latitude and longitude values with a helpful validation message.', label: 'bug', status: 'pr-ready', created: 'Yesterday' }, { id: 11, title: 'Document place search pagination', description: 'Add cursor pagination examples to the API documentation.', label: 'documentation', status: 'analyzing', created: '2 days ago' }], fileCount: 76, coverage: 91 },
  { id: 'pulse-dashboard', name: 'Argon / demo-repo-v1', description: 'A real-time dashboard for product metrics.', readme: 'Pulse Dashboard brings live metrics, charts, and alerts into one focused workspace.', tags: ['React', 'Charts', 'Vite'], files: [sampleFile('src', 'folder', 'Dashboard pages, components, and data hooks.'), sampleFile('public', 'folder', 'Static dashboard assets.'), sampleFile('tests', 'folder', 'Chart and interaction tests.'), sampleFile('package.json', 'file', 'Project scripts and dependencies.'), sampleFile('README.md', 'file', 'Dashboard setup and usage.')], srcFiles: [sampleFile('components', 'folder', 'Reusable charts and metric cards.'), sampleFile('hooks', 'folder', 'Live data subscriptions.'), sampleFile('App.tsx', 'file', 'Dashboard layout and routes.')], issues: [{ id: 8, title: 'Keep chart filters after refresh', description: 'Restore the selected date range and metric filters when the dashboard reloads.', label: 'enhancement', status: 'analyzing', created: '3 hours ago' }, { id: 7, title: 'Fix empty state on slow connections', description: 'Show a loading state before the first metrics response arrives.', label: 'bug', status: 'merged', created: 'Yesterday' }], fileCount: 94, coverage: 89 },
]

const nav: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'code', label: 'Code', icon: Code2 },
  { id: 'issues', label: 'Issues', icon: CircleDot },
  { id: 'pulls', label: 'Pull requests', icon: GitPullRequest },
  { id: 'insights', label: 'AI insights', icon: BrainCircuit },
]

function readIssueStore(): Record<string, Issue[]> {
  try {
    const saved = localStorage.getItem('repomind-issues-by-repo')
    return saved ? JSON.parse(saved) as Record<string, Issue[]> : Object.fromEntries(repositories.map(repo => [repo.id, repo.issues]))
  } catch { return Object.fromEntries(repositories.map(repo => [repo.id, repo.issues])) }
}

function Logo({ compact = false }: { compact?: boolean }) {
  return <div className="brand"><span className="brand-mark"><GitBranch size={compact ? 17 : 19} strokeWidth={2.6} /></span>{!compact && <span>repo<span className="brand-light">mind</span><span className="brand-dot">.</span></span>}</div>
}

function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'green' | 'purple' | 'orange' | 'blue' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}

function StatusBadge({ status }: { status: IssueStatus }) {
  if (status === 'merged') return <Badge tone="purple"><GitMerge size={12} /> Merged</Badge>
  if (status === 'pr-ready') return <Badge tone="green"><GitPullRequest size={12} /> PR ready</Badge>
  return <Badge tone="orange"><span className="pulse-dot" /> Analyzing</Badge>
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const handle = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [onClose])
  return <div className="modal-scrim" onMouseDown={onClose}><div className="modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={event => event.stopPropagation()}><div className="modal-head"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={19} /></button></div>{children}</div></div>
}

function App() {
  const [view, setView] = useState<View>('overview')
  const [repoId, setRepoId] = useState(() => localStorage.getItem('repomind-active-repo') || 'orbit-ui')
  const [issueStore, setIssueStore] = useState<Record<string, Issue[]>>(readIssueStore)
  const [workspaceOpen, setWorkspaceOpen] = useState(false)
  const [issueModal, setIssueModal] = useState(false)
  const [repoModal, setRepoModal] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [path, setPath] = useState('')
  const [branch, setBranch] = useState('main')
  const [branchOpen, setBranchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const repo = repositories.find(item => item.id === repoId) || repositories[0]
  const repoName = repo.name
  const issues = issueStore[repo.id] || repo.issues
  const setIssues = (updater: (current: Issue[]) => Issue[]) => setIssueStore(current => ({ ...current, [repo.id]: updater(current[repo.id] || repo.issues) }))
  const pullNumber = (id: number) => repo.id === 'orbit-ui' ? id - 24 : id + 10
  const [toast, setToast] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const workspaceRef = useRef<HTMLDivElement>(null)

  useEffect(() => { localStorage.setItem('repomind-issues-by-repo', JSON.stringify(issueStore)) }, [issueStore])
  useEffect(() => { localStorage.setItem('repomind-active-repo', repo.id) }, [repo.id])
  useEffect(() => { setSelectedIssue(current => current ? issues.find(issue => issue.id === current.id) || current : null) }, [issues])
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 3500); return () => window.clearTimeout(timer) }, [toast])
  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => { if (!workspaceRef.current?.contains(event.target as Node)) setWorkspaceOpen(false) }
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setWorkspaceOpen(false) }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => { document.removeEventListener('pointerdown', closeOnOutsideClick); document.removeEventListener('keydown', closeOnEscape) }
  }, [])
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); searchRef.current?.focus(); setSearchOpen(true) }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [])

  const activeIssues = issues.filter(issue => issue.status !== 'merged')
  const readyIssues = issues.filter(issue => issue.status === 'pr-ready')
  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return []
    return [
      ...issues.filter(issue => `${issue.title} ${issue.description}`.toLowerCase().includes(q)).map(issue => ({ label: issue.title, type: `Issue #${issue.id}`, action: () => { setSelectedIssue(issue); setSearchOpen(false) } })),
      ...[...repo.files, ...repo.srcFiles].filter(file => file.name.toLowerCase().includes(q)).map(file => ({ label: file.name, type: file.kind === 'folder' ? 'Folder' : 'File', action: () => { setView('code'); setPath(file.kind === 'folder' ? file.name : ''); setSelectedFile(file.kind === 'file' ? file : null); setSearchOpen(false) } })),
    ].slice(0, 6)
  }, [search, issues, repo])

  function navigate(next: View) { setView(next); setMobileOpen(false); setSelectedFile(null); setPath('') }
  function selectRepository(id: string) { setRepoId(id); setWorkspaceOpen(false); setMobileOpen(false); setSelectedIssue(null); setSelectedFile(null); setPath(''); setBranch('main'); setView('overview'); setSearch('') }
  function createIssue(title: string, description: string, label: string) {
    const issue: Issue = { id: Math.max(...issues.map(item => item.id), 0) + 1, title, description, label, status: 'analyzing', created: 'Just now' }
    setIssues(current => [issue, ...current]); setIssueModal(false); setView('issues'); setToast(`Issue #${issue.id} created. RepoMind is analyzing it.`)
    window.setTimeout(() => setIssues(current => current.map(item => item.id === issue.id && item.status === 'analyzing' ? { ...item, status: 'pr-ready' } : item)), 6500)
  }
  function mergeIssue(id: number) { setIssues(current => current.map(issue => issue.id === id ? { ...issue, status: 'merged' } : issue)); setSelectedIssue(null); setToast(`Pull request for issue #${id} merged into main`) }
  function copyCommand() { navigator.clipboard.writeText(`git clone https://repomind.dev/${repoName.toLowerCase().replace(' / ', '/')}.git`).then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 2200) }).catch(() => setToast('Clipboard access is unavailable')) }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-top"><Logo /><button className="icon-button mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={19} /></button></div>
      <div className="workspace-picker" ref={workspaceRef}><button className="workspace-switch" type="button" aria-expanded={workspaceOpen} aria-controls="repository-menu" onClick={() => setWorkspaceOpen(open => !open)}><span className="workspace-avatar">A</span><span className="workspace-copy"><strong>Argon</strong><small>{repoName.split(' / ')[1]}</small></span><ChevronDown size={15} /></button>{workspaceOpen && <div className="workspace-menu" id="repository-menu"><div className="workspace-menu-label">REPOSITORIES</div>{repositories.map(item => <button key={item.id} type="button" className={item.id === repo.id ? 'selected' : ''} onClick={() => selectRepository(item.id)}><GitBranch size={15} /><span>{item.name.split(' / ')[1]}<small>{item.description}</small></span>{item.id === repo.id && <Check size={15} />}</button>)}</div>}</div>
      <div className="nav-section-label">WORKSPACE</div>
      <nav className="sidebar-nav" aria-label="Main navigation">{nav.map(item => <button key={item.id} className={`nav-item ${view === item.id ? 'active' : ''}`} onClick={() => navigate(item.id)}><item.icon size={18} strokeWidth={1.9} /><span>{item.label}</span>{item.id === 'issues' && activeIssues.length > 0 && <span className="nav-count">{activeIssues.length}</span>}{item.id === 'pulls' && readyIssues.length > 0 && <span className="nav-count">{readyIssues.length}</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="sidebar-help"><span className="sidebar-help-icon"><Sparkles size={18} /></span><strong>Your repo, understood.</strong><p>RepoMind maps your code so every fix starts with context.</p><button onClick={() => navigate('insights')}>Explore insights <ArrowRight size={14} /></button></div><button className="sidebar-settings" onClick={() => setRepoModal(true)}><Settings2 size={17} /> Repository settings</button></div>
    </aside>
    {mobileOpen && <div className="mobile-backdrop" onClick={() => setMobileOpen(false)} />}

    <main className="main">
      <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={21} /></button><span className="breadcrumb-muted">Workspace</span><ChevronRight size={14} className="breadcrumb-chevron" /><span className="breadcrumb-strong">{repoName}</span><ChevronDown size={14} className="breadcrumb-down" /></div><div className="topbar-right"><div className="search-wrap"><Search size={16} /><input ref={searchRef} value={search} onChange={event => { setSearch(event.target.value); setSearchOpen(true) }} onFocus={() => setSearchOpen(true)} onKeyDown={event => { if (event.key === 'Escape') setSearchOpen(false); if (event.key === 'Enter' && searchResults[0]) searchResults[0].action() }} placeholder="Search anything..." aria-label="Search repository" /><kbd>⌘ K</kbd>{searchOpen && search.trim() && <div className="search-results">{searchResults.length ? searchResults.map((result, index) => <button key={`${result.type}-${index}`} onClick={result.action}><Search size={14} /><span>{result.label}</span><small>{result.type}</small></button>) : <div className="search-empty">No results found</div>}</div>}</div><button className="icon-button notification" onClick={() => setToast(readyIssues.length ? `${readyIssues.length} pull request${readyIssues.length > 1 ? 's' : ''} ready for review` : 'You are all caught up')} aria-label="Notifications"><Bell size={18} />{readyIssues.length > 0 && <i />}</button><span className="top-avatar">JD</span></div></header>

      <div className="content">
        <div className="repo-header"><div className="repo-heading"><div className="repo-icon"><GitBranch size={23} strokeWidth={2} /></div><div><div className="eyebrow">YOUR REPOSITORY <span className="eyebrow-separator">/</span> PUBLIC</div><h1>{repoName.split(' / ')[1] || repoName}</h1><p>{repo.description}</p></div></div><button className="outline-button header-action" onClick={copyCommand}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Clone repository'}</button></div>
        <div className="repo-tabs">{nav.map(item => <button key={item.id} className={view === item.id ? 'selected' : ''} onClick={() => navigate(item.id)}>{item.label}{item.id === 'issues' && <span>{activeIssues.length}</span>}{item.id === 'pulls' && <span>{readyIssues.length}</span>}</button>)}</div>

        {view === 'overview' && <div className="dashboard">
          <section className="welcome-card"><div className="welcome-copy"><div className="ai-overline"><span><Sparkles size={13} /></span> REPO INTELLIGENCE IS ACTIVE</div><h2>Good code starts with<br /><em>better context.</em></h2><p>RepoMind has mapped your codebase and is ready to turn issues into thoughtful fixes.</p><button onClick={() => navigate('insights')}>Explore codebase insights <ArrowRight size={17} /></button></div><div className="hero-visual" aria-hidden="true"><div className="visual-ring ring-one" /><div className="visual-ring ring-two" /><div className="visual-ring ring-three" /><div className="visual-center"><BrainCircuit size={35} strokeWidth={1.5} /></div><div className="visual-node node-one"><Code2 size={18} /></div><div className="visual-node node-two"><GitPullRequest size={18} /></div><div className="visual-node node-three"><FileCode2 size={18} /></div><div className="visual-node node-four"><CircleDot size={18} /></div><span className="visual-caption">context graph <span>●</span> up to date</span></div></section>
          <section className="stats-grid"><button className="stat-card" onClick={() => navigate('code')}><span className="stat-top"><span className="stat-icon mint"><FileCode2 size={19} /></span><ArrowUpIcon /></span><strong>{repo.fileCount}</strong><span className="stat-label">Files indexed</span><small><span className="green-dot" /> All files understood</small></button><button className="stat-card" onClick={() => navigate('issues')}><span className="stat-top"><span className="stat-icon lavender"><CircleDot size={19} /></span><ArrowUpIcon /></span><strong>{activeIssues.length}</strong><span className="stat-label">Open issues</span><small>Across this repository</small></button><button className="stat-card" onClick={() => navigate('pulls')}><span className="stat-top"><span className="stat-icon peach"><GitPullRequest size={19} /></span><ArrowUpIcon /></span><strong>{readyIssues.length}</strong><span className="stat-label">AI fixes ready</span><small>Waiting for your review</small></button><button className="stat-card" onClick={() => navigate('insights')}><span className="stat-top"><span className="stat-icon ice"><Activity size={19} /></span><ArrowUpIcon /></span><strong>{repo.coverage}<span className="percent">%</span></strong><span className="stat-label">Context coverage</span><small>Across the codebase</small></button></section>
          <div className="dashboard-grid"><section className="panel activity-panel"><div className="panel-header"><div><h3>Recent activity</h3><p>What’s happening in your repository</p></div><button className="text-button" onClick={() => navigate('issues')}>View all <ArrowRight size={15} /></button></div><div className="activity-list">{issues.map(issue => <button className="activity-row activity-button" key={issue.id} onClick={() => setSelectedIssue(issue)}><span className={`activity-icon ${issue.status === 'merged' ? 'activity-purple' : issue.status === 'pr-ready' ? 'activity-green' : 'activity-orange'}`}>{issue.status === 'merged' ? <GitMerge size={17} /> : issue.status === 'pr-ready' ? <GitPullRequest size={17} /> : <BrainCircuit size={17} />}</span><div><strong>{issue.title}</strong><p>Issue #{issue.id} · {issue.status === 'merged' ? 'Merged into main' : issue.status === 'pr-ready' ? 'Ready for review' : 'Analyzing'}</p></div><time>{issue.created}</time></button>)}</div></section><section className="panel next-panel"><div className="panel-header"><div><h3>Up next</h3><p>Keep your project moving</p></div><MoreHorizontal size={19} className="muted-icon" /></div><div className="next-feature"><div className="next-feature-top"><span className="mini-spark"><Sparkles size={18} /></span><Badge tone={readyIssues.length ? 'green' : 'orange'}>{readyIssues.length ? 'READY TO REVIEW' : 'ALL CAUGHT UP'}</Badge></div><h4>{readyIssues[0]?.title || 'No fixes awaiting review'}</h4><p>{readyIssues.length ? 'RepoMind traced the issue and prepared a targeted fix for your review.' : 'Create an issue to start a new investigation.'}</p><button onClick={() => readyIssues.length ? setSelectedIssue(readyIssues[0]) : setIssueModal(true)}>{readyIssues.length ? 'Review pull request' : 'Create an issue'} <ArrowRight size={15} /></button></div><button className="new-issue-link" onClick={() => setIssueModal(true)}><Plus size={17} /> Create a new issue <ArrowRight size={16} /></button></section></div>
          <div className="tip-line"><ShieldCheck size={16} /> Every AI change waits for maintainer review before merging. <button onClick={() => navigate('insights')}>How RepoMind works <ArrowRight size={13} /></button></div>
        </div>}

        {view === 'code' && <div className="page-body"><div className="section-title-row"><div><h2>Code</h2><p>Explore your repository with context on every file.</p></div><button className="outline-button" onClick={copyCommand}>{copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied' : 'Clone'}</button></div><div className="code-toolbar"><div className="branch-control"><button className="outline-button" onClick={() => setBranchOpen(!branchOpen)}><GitBranch size={16} /> {branch} <ChevronDown size={14} /></button>{branchOpen && <div className="branch-menu">{(repo.id === 'orbit-ui' ? ['main', 'develop', 'fix/session-hydration'] : ['main', 'develop']).map(name => <button key={name} onClick={() => { setBranch(name); setBranchOpen(false) }}><GitBranch size={14} /> {name}{branch === name && <Check size={14} />}</button>)}</div>}</div><span><GitBranch size={15} /> <strong>{repo.id === 'orbit-ui' ? 3 : 2}</strong> branches</span><span><GitCommitHorizontal size={16} /> <strong>{repo.id === 'orbit-ui' ? 48 : repo.id === 'atlas-api' ? 31 : 27}</strong> commits</span></div><div className="file-browser panel"><div className="file-browser-head"><div><span className="commit-avatar">JD</span><strong>Jordan Davis</strong><span>{repo.id === 'orbit-ui' ? 'Refactor auth middleware' : repo.id === 'atlas-api' ? 'Improve coordinate validation' : 'Polish metric cards'}</span></div><span><GitCommitHorizontal size={15} /> <code>{repo.id === 'orbit-ui' ? 'a4f82de' : repo.id === 'atlas-api' ? 'c3d71ab' : 'e8b20f4'}</code> · 2 hours ago</span></div><div className="file-path"><button onClick={() => { setPath(''); setSelectedFile(null) }}>{repoName.split(' / ')[1] || repoName}</button>{path && <><ChevronRight size={14} /><button onClick={() => setSelectedFile(null)}>{path}</button></>}{selectedFile && <><ChevronRight size={14} /><strong>{selectedFile.name}</strong></>}</div>{selectedFile ? <div className="file-detail"><div className="file-detail-icon"><FileText size={25} /></div><h3>{selectedFile.name}</h3><p>{selectedFile.summary}</p><div className="context-note"><Sparkles size={17} /><span><strong>RepoMind context</strong><br />This file is part of the {path || 'repository root'} and contributes to the project’s application flow.</span></div></div> : <div className="file-list">{(path === 'src' ? repo.srcFiles : path ? [] : repo.files).map(file => <button key={file.name} className="file-row" onClick={() => file.kind === 'folder' ? setPath(file.name) : setSelectedFile(file)}><span className="file-name">{file.kind === 'folder' ? <Folder size={18} fill="currentColor" strokeWidth={1.5} /> : <File size={18} />}<strong>{file.name}</strong></span><span className="file-message">{file.detail}</span><time>{file.time}</time></button>)}{path && path !== 'src' && <div className="empty-folder"><Folder size={25} /><p>Folder contents are part of the demo preview.</p></div>}</div>}</div><div className="readme panel"><div className="readme-label"><BookOpen size={17} /> README.md</div><h2>{repoName.split(' / ')[1]}</h2><p>{repo.readme}</p><div className="readme-pills">{repo.tags.map((tag, index) => <Badge key={tag} tone={index === 0 ? 'green' : index === 1 ? 'blue' : 'purple'}>{tag}</Badge>)}</div></div></div>}

        {view === 'issues' && <div className="page-body"><div className="section-title-row"><div><h2>Issues</h2><p>Describe a problem. RepoMind will find the relevant code and propose a fix.</p></div><button className="primary-button" onClick={() => setIssueModal(true)}><Plus size={17} /> New issue</button></div><div className="list-panel panel"><div className="list-toolbar"><span><CircleDot size={17} /> <strong>{activeIssues.length} Open</strong><span className="toolbar-divider" /><CheckCheck size={17} /> {issues.length - activeIssues.length} Closed</span><button onClick={() => setToast('Showing all issues')}><Filter size={16} /> All issues <ChevronDown size={14} /></button></div>{issues.map(issue => <button className="issue-row" key={issue.id} onClick={() => setSelectedIssue(issue)}><span className={`issue-state ${issue.status === 'merged' ? 'closed' : ''}`}><CircleDot size={19} /></span><span className="issue-main"><strong>{issue.title}</strong><small>#{issue.id} opened {issue.created} by Jordan Davis</small></span><Badge tone={issue.label === 'bug' ? 'orange' : issue.label === 'documentation' ? 'blue' : 'purple'}>{issue.label}</Badge><StatusBadge status={issue.status} /><ChevronRight size={17} className="row-chevron" /></button>)}</div><div className="hint-panel"><Sparkles size={19} /><div><strong>From issue to solution</strong><p>RepoMind traces dependencies, writes a focused patch, and opens a pull request for your review.</p></div></div></div>}

        {view === 'pulls' && <div className="page-body"><div className="section-title-row"><div><h2>Pull requests</h2><p>Review AI proposed changes before they become part of your codebase.</p></div><Badge tone="green"><span className="green-dot" /> {readyIssues.length} ready for review</Badge></div><div className="list-panel panel"><div className="list-toolbar"><span><GitPullRequest size={17} /> <strong>{readyIssues.length} Open</strong><span className="toolbar-divider" /><GitMerge size={17} /> {issues.filter(issue => issue.status === 'merged').length} Merged</span></div>{readyIssues.length ? readyIssues.map(issue => <button className="issue-row pr-row" key={issue.id} onClick={() => setSelectedIssue(issue)}><span className="issue-state pr"><GitPullRequest size={20} /></span><span className="issue-main"><strong>Fix: {issue.title.toLowerCase()}</strong><small>#{pullNumber(issue.id)} opened by RepoMind AI · linked to issue #{issue.id}</small></span><span className="checks"><Check size={13} /> Checks passed</span><ChevronRight size={17} className="row-chevron" /></button>) : <div className="empty-state"><GitPullRequest size={30} /><h3>No pull requests waiting</h3><p>Open an issue and RepoMind will prepare a fix for your review.</p><button className="primary-button" onClick={() => setIssueModal(true)}>Create issue</button></div>}{issues.filter(issue => issue.status === 'merged').map(issue => <button className="issue-row pr-row" key={issue.id} onClick={() => setSelectedIssue(issue)}><span className="issue-state closed"><GitMerge size={20} /></span><span className="issue-main"><strong>Fix: {issue.title.toLowerCase()}</strong><small>#{pullNumber(issue.id)} merged into main · linked to issue #{issue.id}</small></span><StatusBadge status={issue.status} /><ChevronRight size={17} className="row-chevron" /></button>)}</div><div className="review-banner"><ShieldCheck size={21} /><div><strong>You stay in control.</strong><span>AI prepares the patch. A maintainer reviews and merges it.</span></div></div></div>}

        {view === 'insights' && <div className="page-body"><div className="section-title-row"><div><h2>AI insights</h2><p>A living map of how your repository works.</p></div><Badge tone="green"><span className="green-dot" /> Context up to date</Badge></div><div className="insight-summary"><div className="insight-summary-icon"><BrainCircuit size={28} /></div><div><span className="eyebrow">REPOSITORY INTELLIGENCE</span><h3>RepoMind understands the big picture.</h3><p>Last indexed 2 hours ago, after the latest push to <code>main</code>.</p></div><div className="coverage"><strong>{repo.coverage}%</strong><span>context coverage</span><div><i style={{ width: `${repo.coverage}%` }} /></div></div></div><div className="insight-grid"><div className="insight-card panel"><span className="insight-icon mint"><Folder size={20} /></span><h3>Structure mapped</h3><p>{repo.fileCount} files mapped across the repository. Files and folders are connected to their roles in the project.</p><span>{repo.fileCount} files indexed <ArrowRight size={15} /></span></div><div className="insight-card panel"><span className="insight-icon lavender"><Code2 size={20} /></span><h3>Function behavior</h3><p>Functions and exports are summarized with inputs, outputs, and the features that call them.</p><span>{repo.id === 'orbit-ui' ? 342 : repo.id === 'atlas-api' ? 208 : 261} functions understood <ArrowRight size={15} /></span></div><div className="insight-card panel"><span className="insight-icon peach"><Activity size={20} /></span><h3>Data flow traced</h3><p>Follow how a request moves from the interface through state, API calls, and server responses.</p><span>{repo.id === 'orbit-ui' ? 24 : repo.id === 'atlas-api' ? 18 : 21} flows identified <ArrowRight size={15} /></span></div></div><div className="flow-panel panel"><div className="panel-header"><div><h3>Example flow: {repo.id === 'orbit-ui' ? 'user session' : repo.id === 'atlas-api' ? 'place search' : 'live metrics'}</h3><p>How authentication moves through the project</p></div><Badge tone="blue">AUTO-GENERATED</Badge></div><div className="flow-steps"><span><Code2 size={18} /> {repo.id === 'orbit-ui' ? 'Login form' : repo.id === 'atlas-api' ? 'Search request' : 'Metric filter'}</span><ArrowRight size={17} /><span><FileCode2 size={18} /> {repo.id === 'orbit-ui' ? 'Auth hook' : repo.id === 'atlas-api' ? 'Search route' : 'Data hook'}</span><ArrowRight size={17} /><span><Terminal size={18} /> {repo.id === 'pulse-dashboard' ? 'Metrics API' : 'API client'}</span><ArrowRight size={17} /><span><ShieldCheck size={18} /> {repo.id === 'orbit-ui' ? 'Session store' : repo.id === 'atlas-api' ? 'Place results' : 'Chart state'}</span></div><p className="flow-note"><Sparkles size={16} /> This map helps RepoMind locate the source of issues before proposing a change.</p></div></div>}
      </div>
    </main>

    {issueModal && <IssueForm onClose={() => setIssueModal(false)} onCreate={createIssue} />}
    {repoModal && <Modal title="Repository settings" onClose={() => setRepoModal(false)}><div className="modal-body"><p className="modal-intro">Current repository in Acme workspace.</p><label className="field-label">Repository name<input value={repoName} readOnly /></label><p className="modal-intro">{repo.description}</p><div className="modal-actions"><button className="primary-button" onClick={() => setRepoModal(false)}>Done</button></div></div></Modal>}
    {selectedIssue && <Modal title={selectedIssue.status === 'analyzing' ? `Issue #${selectedIssue.id}` : `Pull request #${pullNumber(selectedIssue.id)}`} onClose={() => setSelectedIssue(null)}><div className="modal-body detail-modal"><div className="detail-status"><StatusBadge status={selectedIssue.status} /><span>Linked to issue #{selectedIssue.id}</span></div><h3>{selectedIssue.status === 'analyzing' ? selectedIssue.title : `Fix: ${selectedIssue.title.toLowerCase()}`}</h3><p>{selectedIssue.description}</p>{selectedIssue.status === 'analyzing' ? <div className="analysis-progress"><span className="spinner" /><div><strong>RepoMind is investigating</strong><p>Tracing relevant files and preparing a focused patch. A pull request will appear here shortly.</p></div></div> : <><div className="change-summary"><div><FileCode2 size={18} /><span><strong>Proposed changes</strong><small>Focused update across related files</small></span></div><span className="diff-count">+24 <i /> −8</span></div><div className="ai-review"><Sparkles size={17} /><div><strong>RepoMind review</strong><p>The change addresses the reported behavior and includes a regression check. Review the patch before merging.</p></div></div>{selectedIssue.status === 'pr-ready' && <div className="modal-actions"><button className="outline-button" onClick={() => setSelectedIssue(null)}>Close</button><button className="primary-button" onClick={() => mergeIssue(selectedIssue.id)}><GitMerge size={17} /> Merge pull request</button></div>}</>}</div></Modal>}
    {toast && <div className="toast"><Check size={16} /> {toast}<button onClick={() => setToast('')} aria-label="Dismiss notification"><X size={14} /></button></div>}
  </div>
}

function ArrowUpIcon() { return <ArrowDownRight size={17} className="stat-arrow" /> }

function IssueForm({ onClose, onCreate }: { onClose: () => void; onCreate: (title: string, description: string, label: string) => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [label, setLabel] = useState('bug')
  function submit(event: FormEvent) { event.preventDefault(); if (title.trim() && description.trim()) onCreate(title.trim(), description.trim(), label) }
  return <Modal title="Create a new issue" onClose={onClose}><form className="modal-body" onSubmit={submit}><p className="modal-intro">Describe what’s wrong or what you’d like to improve. RepoMind will start investigating automatically.</p><label className="field-label">Title<input autoFocus value={title} onChange={event => setTitle(event.target.value)} placeholder="A short, clear summary" required /></label><label className="field-label">Description<textarea value={description} onChange={event => setDescription(event.target.value)} placeholder="What happened? What did you expect?" rows={5} required /></label><label className="field-label">Label<select value={label} onChange={event => setLabel(event.target.value)}><option value="bug">Bug</option><option value="enhancement">Enhancement</option><option value="documentation">Documentation</option></select></label><div className="form-assist"><Sparkles size={17} /> AI analysis begins as soon as you create the issue.</div><div className="modal-actions"><button type="button" className="outline-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button"><Plus size={17} /> Create issue</button></div></form></Modal>
}

export default App

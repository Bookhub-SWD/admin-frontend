import { Plus, Search, Filter, MoreHorizontal, BookMarked, Layers, User } from 'lucide-react';

const Books = () => {
  const books = [
    { id: 'ISBN-01-978', title: 'The Pragmatic Programmer', author: 'Andy Hunt', category: 'Software Engineering', status: 'In Stock' },
    { id: 'ISBN-02-978', title: 'Clean Code: A Handbook', author: 'Robert C. Martin', category: 'Software Engineering', status: 'Borrowed' },
    { id: 'ISBN-03-978', title: 'Atomic Habits', author: 'James Clear', category: 'Applied Psychology', status: 'In Stock' },
    { id: 'ISBN-04-978', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Classic Literature', status: 'In Stock' },
    { id: 'ISBN-05-978', title: 'Structure & Interpretation', author: 'Harold Abelson', category: 'Computer Science', status: 'Borrowed' },
  ];

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex justify-between items-end border-b border-oxford-blue/10 pb-8">
        <div>
          <h1 className="text-4xl font-serif font-black text-oxford-blue mb-2 tracking-tight">Library Management</h1>
          <p className="text-charcoal/70 font-sans font-medium italic">Manage your library inventory, status, and book assets.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 border border-oxford-blue/30 text-oxford-blue font-mono text-xs font-black uppercase tracking-widest hover:bg-oxford-blue/5 transition-colors rounded-academic">
            Import Excel
          </button>
          <button className="btn-academic flex items-center gap-2 text-xs">
            <Plus className="h-4 w-4" />
            Add New Book
          </button>
        </div>
      </div>

      {/* Registry Table */}
      <div className="card-academic overflow-hidden bg-white shadow-2xl relative">
        <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="p-6 bg-parchment/30 border-b border-oxford-blue/10 flex justify-between items-center">
          <div className="flex gap-8">
            <div className="flex items-center gap-2 group cursor-pointer">
              <BookMarked className="h-4 w-4 text-brass" />
              <span className="text-xs font-mono font-black text-oxford-blue uppercase tracking-widest border-b border-brass/50">Total Books: 12,450</span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer">
              <Layers className="h-4 w-4 text-oxford-blue/40" />
              <span className="text-xs font-mono font-black text-charcoal/70 uppercase tracking-widest">In Stock: 11,201</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-oxford-blue/30" />
              <input 
                type="text" 
                placeholder="Search by ISBN or Title..." 
                className="bg-white border border-oxford-blue/20 rounded-academic pl-10 pr-4 py-2 text-xs text-charcoal focus:outline-none focus:border-brass/30 w-64 uppercase font-mono font-black tracking-widest"
              />
            </div>
            <button className="p-2 border border-oxford-blue/10 rounded-academic text-oxford-blue/40 hover:text-brass transition-colors">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-oxford-blue text-parchment uppercase font-mono text-xs font-black tracking-[0.2em]">
              <th className="px-8 py-5 border-r border-parchment/10">Book Details</th>
              <th className="px-8 py-5 border-r border-parchment/10">ISBN No.</th>
              <th className="px-8 py-5 border-r border-parchment/10">Category</th>
              <th className="px-8 py-5 border-r border-parchment/10">Availability</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-oxford-blue/5">
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-parchment/50 transition-colors group">
                <td className="px-8 py-6 border-r border-oxford-blue/5">
                  <div className="text-lg font-serif font-black text-oxford-blue leading-tight group-hover:text-brass transition-colors">{book.title}</div>
                  <div className="flex items-center gap-2 text-xs text-charcoal/60 font-black uppercase tracking-widest mt-1">
                    <User className="h-3.5 w-3.5" /> {book.author}
                  </div>
                </td>
                <td className="px-8 py-6 border-r border-oxford-blue/5">
                  <div className="font-mono text-xs font-black text-brass uppercase tracking-widest bg-brass/5 px-2 py-1 rounded-sm inline-block">{book.id}</div>
                </td>
                <td className="px-8 py-6 border-r border-oxford-blue/5">
                  <span className="text-xs font-mono font-black text-charcoal/80 uppercase tracking-widest border border-oxford-blue/20 px-2 py-1 rounded-academic">{book.category}</span>
                </td>
                <td className="px-8 py-6 border-r border-oxford-blue/5">
                  <div className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${
                      book.status === 'In Stock' ? 'bg-brass shadow-[0_0_8px_var(--color-brass)]' : 
                      book.status === 'Borrowed' ? 'bg-oxford-blue animate-pulse' : 'bg-charcoal/20'
                    }`}></div>
                    <span className={`text-xs font-mono font-black uppercase tracking-widest ${
                      book.status === 'In Stock' ? 'text-brass' : 'text-oxford-blue/80'
                    }`}>
                      {book.status}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                   <button className="text-oxford-blue/20 hover:text-brass transition-colors">
                      <MoreHorizontal className="h-5 w-5" />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="p-6 bg-parchment/10 border-t border-oxford-blue/5 flex justify-between items-center text-xs font-mono font-black text-charcoal/60 uppercase tracking-[0.3em]">
          <span>Showing 1-5 of 12,450 books</span>
          <div className="flex gap-6">
            <button className="hover:text-oxford-blue disabled:opacity-20 font-black" disabled>Previous Page</button>
            <button className="hover:text-oxford-blue font-black">Next Page</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Books;

function MovingBg({ children }) {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 from-cyan-600 via-cyan-800 to-emerald-600 animate-gradient bg-gradient-to-r bg-[length:400%_400%] -z-10"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
    
  );
}

export default MovingBg;
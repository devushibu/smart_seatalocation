import React from 'react';
import { School, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-muted/40 backdrop-blur-md mt-auto py-6 px-6 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600/10 p-1.5 rounded-lg border border-indigo-500/20 text-indigo-500">
            <School size={16} />
          </div>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Smart Exam Portal
          </span>
        </div>

        {/* Copyright */}
        <p className="text-xs text-muted-foreground font-medium text-center">
          &copy; {currentYear} Smart Exam Seat Allocation System. All rights reserved.
        </p>

        {/* Made with heart */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Made with</span>
          <Heart size={12} className="text-red-500 fill-red-500/30 animate-pulse" />
          <span>for Educational Excellence</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

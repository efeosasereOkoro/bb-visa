/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useForm } from '../../context/FormContext';
import { ChevronLeft } from 'lucide-react';

export const GovBBLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, goToPrevious } = useForm();
  const showBack = state.currentStep !== 'START_PAGE' && state.currentStep !== 'GATEWAY';

  return (
    <div className="min-h-screen bg-[#f3f2f1] font-sans text-[#0b0c0c]">
      {/* Government Header */}
      <header className="bg-black text-white border-b-[10px] border-[#005ea5]">
        <div className="max-w-[960px] mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-black font-bold">BB</span>
            </div>
            <span className="font-bold text-xl tracking-tight uppercase">Government of Barbados</span>
          </div>
          <div className="h-6 w-[1px] bg-white opacity-30 mx-2" />
          <span className="text-lg font-medium opacity-90">Digital Services</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[960px] mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {showBack && (
              <button
                onClick={goToPrevious}
                className="flex items-center gap-1 text-[#0b0c0c] hover:text-[#505a5f] underline decoration-2 underline-offset-4 mb-6 transition-colors"
                id="back-link"
              >
                <ChevronLeft size={20} />
                Back
              </button>
            )}
            
            <div className="bg-white p-6 md:p-12 shadow-sm border-b-[5px] border-[#005ea5]">
              {children}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-[#dee0e2] mt-12 py-12 border-t-[1px] border-[#b1b4b6]">
        <div className="max-w-[960px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-bold mb-4">Government of Barbados</h2>
            <ul className="space-y-2 text-sm underline decoration-1 border-opacity-50">
              <li><a href="#" className="hover:text-[#005ea5]">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#005ea5]">Terms and conditions</a></li>
              <li><a href="#" className="hover:text-[#005ea5]">Accessibility statement</a></li>
              <li><a href="#" className="hover:text-[#005ea5]">Cookie policy</a></li>
            </ul>
          </div>
          <div className="text-sm opacity-70 flex items-end justify-end">
             &copy; 2026 Government of Barbados
          </div>
        </div>
      </footer>
    </div>
  );
};

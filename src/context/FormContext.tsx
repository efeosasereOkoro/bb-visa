/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { FormState, FormStep } from '../types/form';
import { getNextStep, getPreviousStep } from '../lib/routing-engine';

interface FormContextType {
  state: FormState;
  updateState: (updates: Partial<FormState>) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  setStep: (step: FormStep) => void;
}

const initialState: FormState = {
  currentStep: 'GATEWAY', 
  journeyType: undefined,
  errors: {},
  isSubmitted: false,
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FormState>(initialState);

  const updateState = useCallback((updates: Partial<FormState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const setStep = useCallback((step: FormStep) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const goToNext = useCallback(() => {
    const nextStep = getNextStep(state);
    setState((prev) => ({ ...prev, currentStep: nextStep }));
    window.scrollTo(0, 0);
  }, [state]);

  const goToPrevious = useCallback(() => {
    const prevStep = getPreviousStep(state);
    setState((prev) => ({ ...prev, currentStep: prevStep }));
    window.scrollTo(0, 0);
  }, [state]);

  const value = useMemo(() => ({
    state,
    updateState,
    goToNext,
    goToPrevious,
    setStep,
  }), [state, updateState, goToNext, goToPrevious, setStep]);

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};

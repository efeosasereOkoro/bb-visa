/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormState, FormStep } from '../types/form';

/**
 * Determines the next step in the form flow based on current state.
 * Implements "one block of things per page" and conditional routing.
 */
export const getNextStep = (state: FormState): FormStep => {
  switch (state.currentStep) {
    case 'GATEWAY':
      return 'START_PAGE';

    case 'START_PAGE':
      return 'ELIGIBILITY';

    case 'ELIGIBILITY':
      // Conditional branching logic per pathway
      switch (state.journeyType) {
        case 'PASSPORT':
          if (state.age !== undefined && state.age >= 16 && state.subType === 'CHILD') return 'EXIT_INELIGIBLE';
          if (state.isBarbadosCitizen === false) return 'EXIT_INELIGIBLE';
          return 'PERSONAL_DETAILS';
        
        case 'WORK_PERMIT':
          return 'PERSONAL_DETAILS';
          
        case 'CITIZENSHIP':
          return 'PERSONAL_DETAILS';
          
        case 'STUDY':
          return 'H1_REFERENCE';
          
        case 'RESIDENCY':
          return 'PERSONAL_DETAILS';
          
        default:
          return 'PERSONAL_DETAILS';
      }

    case 'H1_REFERENCE':
      return 'PERSONAL_DETAILS';

    case 'PERSONAL_DETAILS':
      return 'PASSPORT_DETAILS';

    case 'PASSPORT_DETAILS':
      if (state.journeyType === 'WORK_PERMIT' || state.journeyType === 'RESIDENCY') {
        return 'SKILL_CATEGORY';
      }
      return 'ADDRESS_BLOCK';

    case 'SKILL_CATEGORY':
      // Logic for Professional Agency trigger
      const needsAgency = ['NURSE', 'TEACHER', 'MEDIA_PERSON', 'ARTISAN'].includes(state.work?.skillCategory || '');
      if (needsAgency) return 'PROFESSIONAL_AGENCY';
      return 'ADDRESS_BLOCK';

    case 'PROFESSIONAL_AGENCY':
      return 'ADDRESS_BLOCK';

    case 'ADDRESS_BLOCK':
      if (state.journeyType === 'CITIZENSHIP' || state.journeyType === 'RESIDENCY') {
        return 'RESIDENCE_HISTORY';
      }
      return 'CONTACT_BLOCK';

    case 'RESIDENCE_HISTORY':
      return 'CONTACT_BLOCK';

    case 'CONTACT_BLOCK':
      return 'DEPENDANT_DETAILS';

    case 'DEPENDANT_DETAILS':
      if (state.journeyType === 'PASSPORT' || state.journeyType === 'CITIZENSHIP') {
        return 'BACKGROUND_CHECKS';
      }
      return 'EVIDENCE_UPLOAD';

    case 'BACKGROUND_CHECKS':
      return 'EXCLUDED_CLASSES';

    case 'EXCLUDED_CLASSES':
      return 'EVIDENCE_UPLOAD';

    case 'EVIDENCE_UPLOAD':
      return 'CHECK_YOUR_ANSWERS';

    case 'CHECK_YOUR_ANSWERS':
      return 'PAYMENT';

    case 'PAYMENT':
      return 'CONFIRMATION';

    default:
      return 'GATEWAY';
  }
};

/**
 * Determines the previous step for the "Back" button.
 */
export const getPreviousStep = (state: FormState): FormStep => {
  switch (state.currentStep) {
    case 'START_PAGE': return 'GATEWAY';
    case 'ELIGIBILITY': return 'START_PAGE';
    case 'PERSONAL_DETAILS': return 'ELIGIBILITY';
    case 'H1_REFERENCE': return 'ELIGIBILITY';
    case 'PASSPORT_DETAILS': return 'PERSONAL_DETAILS';
    case 'SKILL_CATEGORY': return 'PASSPORT_DETAILS';
    case 'PROFESSIONAL_AGENCY': return 'SKILL_CATEGORY';
    case 'ADDRESS_BLOCK': 
      if (state.journeyType === 'WORK_PERMIT' || state.journeyType === 'RESIDENCY') return 'SKILL_CATEGORY';
      return 'PASSPORT_DETAILS';
    case 'RESIDENCE_HISTORY': return 'ADDRESS_BLOCK';
    case 'CONTACT_BLOCK': 
      if (state.journeyType === 'CITIZENSHIP' || state.journeyType === 'RESIDENCY') return 'RESIDENCE_HISTORY';
      return 'ADDRESS_BLOCK';
    case 'DEPENDANT_DETAILS': return 'CONTACT_BLOCK';
    case 'BACKGROUND_CHECKS': return 'DEPENDANT_DETAILS';
    case 'EXCLUDED_CLASSES': return 'BACKGROUND_CHECKS';
    case 'EVIDENCE_UPLOAD': 
      if (state.journeyType === 'PASSPORT' || state.journeyType === 'CITIZENSHIP') return 'EXCLUDED_CLASSES';
      return 'DEPENDANT_DETAILS';
    case 'CHECK_YOUR_ANSWERS': return 'EVIDENCE_UPLOAD';
    case 'PAYMENT': return 'CHECK_YOUR_ANSWERS';
    default: return 'GATEWAY';
  }
};

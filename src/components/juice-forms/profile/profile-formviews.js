import EditEmergencyContactInfo from './edit-emergency-contact/edit-emergency-contact';
import formView from '../components/form-view/form-view';

export const EditEmergencyContactInfoView = formView({
  backPath: 'profile_information',
  backText: 'personal_information',
  title: 'edit_emergency_info',
  WrappedComponent: EditEmergencyContactInfo,
});
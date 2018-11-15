import i18n from '../utils/i18n/i18n';

export function relationshipOptions() {
    return [
      {
        display: i18n.t('relationships_dependent'),
        value: 'Dependent',
      },
      {
        display: i18n.t('relationships_sibling'),
        value: 'Sibling',
      },
      {
        display: i18n.t('relationships_parent'),
        value: 'Parent',
      },
      {
        display: i18n.t('relationships_friend'),
        value: 'Friend',
      },
      {
        display: i18n.t('relationships_guardian'),
        value: 'Guardian',
      },
      {
        display: i18n.t('relationships_child'),
        value: 'Child',
      },
      {
        display: i18n.t('relationships_relative'),
        value: 'Relative',
      },
      {
        display: i18n.t('relationships_spouse_significant_other'),
        value: 'Spouse_Significant_Other',
      },
    ];
  }
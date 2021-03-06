import { IOptions } from '../interface/options';

const defaultOption: IOptions = {
  // Basic
  grid: 1,
  today: null,
  nextBtnText: '>',
  prevBtnText: '<',

  // Animation
  mode: '',
  animationTiming: 'ease-in-out',
  animationDuration: 200,
  animationDirection: 'horizon',

  // Range
  range: false,
  rangeIncludeDisabled: false,
  rangeDistanceDay: 0,
  rangeEqualDateDelete: true,

  // Multiple
  multiple: false,
  multipleMaximum: 0,

  // Language
  lang: 'ko',
  locale: null,

  // Min, Max Date
  minDate: null,
  maxDate: null,

  // initial
  initialDate: [],

  // Touch
  touchEvent: true,

  // Highlighted
  highlightedDate: [],
  highlightedToday: false,

  // Hide
  hideTodayBtn: false,
  hideClearBtn: false,
  hidePrevNextBtn: false,
  hidePrevNextDate: false,
  hideWeek: false,

  // Disabled day
  disabledDate: [],

  // Holiday
  holidayDate: [],

  // Class
  containerClass: '',
  headerClass: '',
  titleClass: '',
  controlsClass: '',
  controlsTitleClass: '',
  controlsPrevClass: '',
  controlsNextClass: '',
  controlsTodayClass: '',
  controlsClearClass: '',
  mainClass: '',
  footerClass: '',
  weekClass: '',
  dowClass: '',
  gridClass: '',
  daysClass: '',
  dayClass: '',
  sundayClass: 'sunday',
  saturdayClass: 'saturday',
  holidayClass: 'holiday',
  firstDayClass: 'first',
  lastDayClass: 'last',
  startDayClass: 'start',
  endDayClass: 'end',

  // Custom
  customDayElement: null,
  customInsertBeforeDay: null,
  customInsertAfterDay: null,

  // Callback
  beforeClickDay: null,
  beforeEffect: null,
  beforeRender: null,

  isClickDayEqual: null,
  isClickIncludeDisabled: null,
  isClickMultipleMaximum: null,

  afterClickDay: null,
  afterEffect: null,
  afterRender: null,
};

export default defaultOption;

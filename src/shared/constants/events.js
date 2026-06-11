export const DEFAULT_DURATION = 1800; // 30 minutes fallback

export const CRICKET_TAGS = [
  // Runs
  { label: 'Dot Ball',  category: 'runs'       },
  { label: 'Single',    category: 'runs'       },
  { label: 'Double',    category: 'runs'       },
  { label: 'Triple',    category: 'runs'       },
  { label: 'Four',      category: 'runs'       },
  { label: 'Six',       category: 'runs'       },
  // Extras
  { label: 'Wide',      category: 'extras'     },
  { label: 'No Ball',   category: 'extras'     },
  { label: 'Bye',       category: 'extras'     },
  { label: 'Leg Bye',   category: 'extras'     },
  // Wickets
  { label: 'Wicket',    category: 'wicket'     },
  { label: 'Bowled',    category: 'wicket'     },
  { label: 'Caught',    category: 'wicket'     },
  { label: 'LBW',       category: 'wicket'     },
  { label: 'Run Out',   category: 'wicket'     },
  { label: 'Stumped',   category: 'wicket'     },
  { label: 'Hit Wicket',category: 'wicket'     },
  { label: 'Retired',   category: 'wicket'     },
  // Milestones
  { label: 'Fifty',           category: 'milestone'  },
  { label: 'Century',         category: 'milestone'  },
  { label: 'Double Century',  category: 'milestone'  },
  { label: 'Hat-trick',       category: 'milestone'  },
  { label: '5-Wicket Haul',   category: 'milestone'  },
  { label: 'Maiden Over',     category: 'milestone'  },
  // Match events
  { label: 'DRS Review',  category: 'match'      },
  { label: 'Powerplay',   category: 'match'      },
  { label: 'Super Over',  category: 'match'      },
  { label: 'Last Ball',   category: 'match'      },
  { label: 'Free Hit',    category: 'match'      },
];

export const TAG_CATEGORY_STYLES = {
  runs:      { base: 'border-blue-500/40  text-blue-300',   active: 'bg-blue-500   border-blue-400   text-white' },
  extras:    { base: 'border-yellow-500/40 text-yellow-300', active: 'bg-yellow-500 border-yellow-400 text-black' },
  wicket:    { base: 'border-red-500/40   text-red-300',    active: 'bg-red-500    border-red-400    text-white' },
  milestone: { base: 'border-green-500/40 text-green-300',  active: 'bg-green-500  border-green-400  text-white' },
  match:     { base: 'border-purple-500/40 text-purple-300',active: 'bg-purple-500 border-purple-400 text-white' },
};

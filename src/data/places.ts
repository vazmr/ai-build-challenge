// Illustrative campus places for the prototype map. Positions are schematic (0-100 grid), NOT real
// coordinates, and nothing here implies live location, hours or availability.

export type MapLayer = 'Study' | 'Dining' | 'Events' | 'Resources' | 'Organizations' | 'Technology' | 'Campus Life' | 'Other'
export const MAP_LAYERS: MapLayer[] = ['Study', 'Dining', 'Events', 'Resources', 'Organizations', 'Technology', 'Campus Life', 'Other']

export interface Place { id: string; name: string; x: number; y: number; layers: MapLayer[]; note: string }

export const PLACES: Place[] = [
  { id: 'pl-gittis', name: 'Howard Gittis Student Center', x: 38, y: 34, layers: ['Campus Life', 'Dining', 'Events', 'Organizations'], note: 'Student life hub (illustrative).' },
  { id: 'pl-charles', name: 'Charles Library', x: 62, y: 28, layers: ['Study', 'Resources', 'Events'], note: 'Study spaces and resources (illustrative).' },
  { id: 'pl-tech', name: 'TECH Center', x: 52, y: 58, layers: ['Technology', 'Study', 'Events'], note: 'Technology and collaboration space (illustrative).' },
  { id: 'pl-tuttleman', name: 'Tuttleman Learning Center', x: 24, y: 62, layers: ['Study', 'Events'], note: 'Classrooms and learning space (illustrative).' },
  { id: 'pl-annenberg', name: 'Annenberg Hall', x: 76, y: 52, layers: ['Resources', 'Events', 'Other'], note: 'Academic building (illustrative).' },
]

// Real places around Temple University's Main Campus (North Philadelphia). Names and coordinates come from
// OpenStreetMap and are approximate. Notes are intentionally generic: no hours, prices, availability or
// service details are claimed. Students should confirm details with official sources.

export type MapLayer = 'Study' | 'Dining' | 'Events' | 'Resources' | 'Organizations' | 'Technology' | 'Campus Life' | 'Other'
export const MAP_LAYERS: MapLayer[] = ['Study', 'Dining', 'Events', 'Resources', 'Organizations', 'Technology', 'Campus Life', 'Other']

/** Pin colors per layer (the first layer of a place decides its color). */
export const LAYER_COLORS: Record<MapLayer, string> = {
  Study: '#1f5fa8', Dining: '#c2570c', Events: '#a71930', Resources: '#1d7a46',
  Organizations: '#6d3b9e', Technology: '#0b7285', 'Campus Life': '#a07800', Other: '#5f646b',
}

export interface Place {
  id: string
  name: string
  lat: number
  lng: number
  layers: MapLayer[]
  note: string
  /** Main landmarks get a full pin; everything else is a smaller dot to keep the map readable. */
  featured?: boolean
}

export const CAMPUS_CENTER: [number, number] = [39.9808, -75.1548]
export const CAMPUS_ZOOM = 16

let n = 0
const place = (name: string, lat: number, lng: number, layers: MapLayer[], note: string, featured = false): Place =>
  ({ id: `pl-${++n}`, name, lat, lng, layers, note, featured: featured || undefined })

export const PLACES: Place[] = [
  // Landmarks
  place('Howard Gittis Student Center', 39.979356, -75.154976, ['Campus Life', 'Organizations', 'Events', 'Dining'], 'Student life hub on N 13th St.', true),
  place('Charles Library', 39.982148, -75.155368, ['Study', 'Resources', 'Events', 'Organizations'], 'Main campus library at 1900 N 13th St.', true),
  place('TECH Center', 39.980117, -75.153139, ['Technology', 'Study', 'Events'], 'Technology and collaboration space.', true),
  place('Tuttleman Learning Center', 39.9803572, -75.1541994, ['Study', 'Events', 'Organizations'], 'Learning center at 1809 N 13th St.', true),
  place('Annenberg Hall', 39.9839997, -75.1549674, ['Events', 'Other'], 'Academic building on N 13th St.', true),
  place('Mitten Hall', 39.981921, -75.1566744, ['Campus Life', 'Events'], 'Historic campus building on N Broad St.', true),
  place('Liacouras Center', 39.9798139, -75.1585825, ['Events', 'Campus Life'], 'Arena at 1776 N Broad St.', true),
  place('Temple Performing Arts Center', 39.981442, -75.156813, ['Events', 'Campus Life'], 'Performing arts venue on campus.', true),
  place('Independence Blue Cross Student Recreation Center', 39.979199, -75.158996, ['Campus Life'], 'Student recreation and fitness center.', true),
  place('Temple University Station', 39.98081, -75.15067, ['Other'], 'Regional rail station on W Berks St. Check SEPTA for real schedules.', true),
  place('Cecil B. Moore Station', 39.978572, -75.158095, ['Other'], 'Broad Street Line subway station. Check SEPTA for real schedules.', true),

  // Study and technology
  place('Charles L. Blockson Afro-American Collection', 39.981367, -75.156195, ['Study', 'Resources'], 'Research collection and library space.'),
  place('Engineering Building', 39.982397, -75.152766, ['Technology', 'Study'], 'Academic building for engineering.'),
  place('Common Grounds', 39.979101, -75.162307, ['Technology', 'Study'], 'Internet cafe near campus.'),

  // Dining (coffee, meals, groceries)
  place('Starbucks', 39.979488, -75.154858, ['Dining'], 'Coffee shop near the student center.'),
  place('Saxbys', 39.981662, -75.156078, ['Dining'], 'Coffee shop on N Broad St.'),
  place('Cloud Coffee', 39.982811, -75.153573, ['Dining'], 'Coffee shop near Tyler School of Art.'),
  place('Lucky Cup Cafe', 39.984004, -75.155087, ['Dining'], 'Cafe north of campus.'),
  place('Halal Carts', 39.979627, -75.155495, ['Dining'], 'Food carts near the student center. Carts and offerings change, so check in person.'),
  place('Chipotle', 39.979546, -75.153711, ['Dining'], 'Fast-casual restaurant on N 13th St.'),
  place('Cava', 39.979475, -75.153183, ['Dining'], 'Fast-casual restaurant on N 12th St.'),
  place('Potbelly', 39.979577, -75.153569, ['Dining'], 'Sandwich shop near campus.'),
  place('Five Guys', 39.978708, -75.153662, ['Dining'], 'Burger restaurant near campus.'),
  place('Honeygrow', 39.978472, -75.157466, ['Dining'], 'Restaurant on N Broad St.'),
  place('Blaze Pizza', 39.979531, -75.153392, ['Dining'], 'Pizza restaurant near campus.'),
  place('Insomnia Cookies', 39.978463, -75.157375, ['Dining'], 'Cookie shop on N Broad St.'),
  place('The Fresh Grocer', 39.976852, -75.15764, ['Dining', 'Resources'], 'Supermarket south of campus for groceries.'),
  place('7-Eleven (Broad St)', 39.982039, -75.156057, ['Dining'], 'Convenience store on N Broad St.'),

  // Resources and services
  place('Temple University Bookstore', 39.979435, -75.155016, ['Resources', 'Campus Life'], 'Campus bookstore near the student center.'),
  place('Temple University Police Station', 39.979718, -75.152924, ['Resources'], 'Campus police station. In an emergency, call 911.'),
  place('Temple University Police Substation', 39.981673, -75.156339, ['Resources'], 'Campus police substation on N Broad St.'),
  place('CVS Pharmacy', 39.978428, -75.153807, ['Resources'], 'Pharmacy near campus.'),
  place('Post Office', 39.979523, -75.154756, ['Resources'], 'Postal services near the student center.'),
  place('PNC Bank', 39.981835, -75.156035, ['Resources', 'Other'], 'Bank branch on N Broad St.'),

  // Campus life and recreation
  place('STAR Complex', 39.9811, -75.159689, ['Campus Life'], 'Student training and recreation complex.'),
  place('AMC Broadstreet 7', 39.977496, -75.158479, ['Campus Life', 'Events'], 'Movie theater near campus.'),

  // Getting around
  place('Indego Bike Share: 13th & Montgomery', 39.98005, -75.15522, ['Other'], 'Bike share dock near the student center.'),
  place('Indego Bike Share: Broad & Cecil B. Moore', 39.97887, -75.15777, ['Other'], 'Bike share dock near the Broad Street Line.'),
]

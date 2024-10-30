const ROOMS = {
  Sanctuary: {
    resources: [
      'Chairs',
      'TV',
      'Piano',
      'a/v sound system',
      'keyboard',
      'drums',
      'podium',
      'microphones'
    ],
    capacity: 325,
    calendarID: 'c_18835g31o295uih4iv40qgpl9msku@resource.calendar.google.com'
  },
  Chapel: {
    resources: [
      'Chairs',
      'TV',
      'Piano',
      'a/v sound system',
      'keyboard',
      'drums',
      'podium',
      'microphones'
    ],
    capacity: 150,
    calendarID: 'c_188b6ubdo8seaildk4f2le23o49uk@resource.calendar.google.com'
  },
  A101: {
    resources: [ 'Folding Tables', 'Chairs' ],
    capacity: 15,
    calendarID: 'c_188bqg20i62qsh0mkf5tsllv6hsfg@resource.calendar.google.com'
  },
  A102: {
    resources: [ 'Folding Tables', 'Chairs' ],
    capacity: 15,
    calendarID: 'c_188dilmvbopimgirhfjmcpdo1jshi@resource.calendar.google.com'
  },
  'A103/104': {
    resources: [ 'Folding Tables', 'Chairs', 'TV', 'White Board' ],
    capacity: 30,
    calendarID: 'c_18848ij2sabpqis0ll3sqg3s95ivs@resource.calendar.google.com'
  },
  A105: {
    resources: [ 'Table', 'Chairs', 'TV', 'Piano' ],
    capacity: 15,
    calendarID: 'c_188e5euhmi4nmjeng6nkl34o22fq8@resource.calendar.google.com'
  },
  'A114/115': {
    resources: [ 'Folding Tables', 'Chairs', 'White Board', 'Piano' ],
    capacity: 20,
    calendarID: 'c_188fltio3106ogrtgluj5te8rvfmg@resource.calendar.google.com'
  },
  A201: {
    resources: [ 'Folding Tables', 'Chairs', 'TV', 'White Board', 'sound system' ],
    capacity: 40,
    calendarID: 'c_188756kclcd6ahthi4sqbp673sh5o@resource.calendar.google.com'
  },
  'B101/102': {
    resources: [ 'Tables', 'Chairs', 'TV', 'White Board' ],
    capacity: 30,
    calendarID: 'c_188fcf8i3p5niju4k2a6f6fvaehp0@resource.calendar.google.com'
  },
  'B103/104': {
    resources: [ 'Tables', 'Chairs', 'TV', 'White Board' ],
    capacity: 30,
    calendarID: 'c_188bc4he6clu0gpljf13ggahd7v7i@resource.calendar.google.com'
  },
  B105: {
    resources: [ 'Tables', 'Chairs', 'TV', 'Copier / Printer' ],
    capacity: 20,
    calendarID: 'c_188auklb38pvcj4uhn6jeqk5foprk@resource.calendar.google.com'
  },
  'C101/102': {
    resources: [ 'Folding Tables', 'Chairs', 'TV', 'White Board', 'Piano' ],
    capacity: 40,
    calendarID: 'c_1888gb8fgqvdcij6j9h2u90hatk9e@resource.calendar.google.com'
  },
  'C103/104': {
    resources: [
      'Folding Tables',
      'Chairs',
      'TV',
      'White Board',
      'Piano',
      'adjoining bathroom'
    ],
    capacity: 40,
    calendarID: 'c_188d87cvkjb86hl7hite45rpp9d8u@resource.calendar.google.com'
  },
  'C201/202': {
    resources: [ 'Folding Tables', 'Chairs', 'TV', 'White Board', 'Piano' ],
    capacity: 40,
    calendarID: 'c_188d6pkuca12kjr6mmul2blipac9s@resource.calendar.google.com'
  },
  'C203/204': {
    resources: [ 'Folding Tables', 'Chairs', 'TV', 'White Board', 'Piano' ],
    capacity: 40,
    calendarID: 'c_188a3ogonup3cit1ka152tcaun0bc@resource.calendar.google.com'
  },
  'D103 Conf. Rm': {
    resources: [ 'Tables', 'Chairs', 'TV', 'White Board' ],
    capacity: 25,
    calendarID: 'c_188768fts4homhkshlt79oqef6i2e@resource.calendar.google.com'
  }
}

export const roomsGrouped = {
  "Main Buildings": ["Sanctuary", "Chapel"],
  'A-Building': ["A101", "A102", "A103/104", "A105", "A114/115", "A201"],
  'B-Building': ["B101/102", "B103/104", "B105"],
  'C-Building': ["C101/102", "C103/104", "C201/202", "C203/204"],
  'D-Building': ["D103 Conf. Rm"]
};

export const roomListSimple = [
  "Sanctuary",
  "Chapel",
  "A101",
  "A102",
  "A103/104",
  "A105",
  "A114/115",
  "A201",
  "B101/102",
  "B103/104",
  "B105",
  "C101/102",
  "C103/104",
  "C201/202",
  "C203/204",
  "D103 Conf. Rm"
];

export default ROOMS;
// Scripted, simulated assistant. NOT a live AI model. Answers only point to demo resources and never
// state hours, eligibility, policies or contacts.

export interface AssistantScript {
  id: string
  keywords: string[]
  response: string
  sourceResourceIds: string[]
}

export const SCRIPTS: AssistantScript[] = [
  { id: 'as-academic', keywords: ['advis', 'class', 'course', 'tutor', 'study', 'grade', 'academic'], response: 'For course planning or study help, start with the academic entries below. This prototype can’t tell you who your advisor is or when anyone is available. Please confirm details through official Temple sources.', sourceResourceIds: ['res-advising', 'res-tutoring'] },
  { id: 'as-career', keywords: ['job', 'intern', 'resume', 'career', 'network'], response: 'Career support entries are listed below. Real offerings, deadlines and contacts should be checked on official Temple career pages.', sourceResourceIds: ['res-career'] },
  { id: 'as-wellness', keywords: ['stress', 'anxious', 'anxiety', 'counsel', 'mental', 'wellness', 'sad', 'overwhelmed'], response: 'I’m sorry you’re dealing with that. This prototype only has a placeholder wellness entry. If you or someone else needs help right now, please contact official campus or emergency services.', sourceResourceIds: ['res-wellness'] },
  { id: 'as-money', keywords: ['money', 'aid', 'tuition', 'bill', 'financial', 'afford'], response: 'There’s a placeholder entry for financial questions. I can’t state deadlines, eligibility or amounts, so please check official Temple sources.', sourceResourceIds: ['res-finaid'] },
  { id: 'as-tech', keywords: ['wifi', 'wi-fi', 'computer', 'laptop', 'tech', 'software', 'password'], response: 'Technology help is a placeholder entry here. It sits at the TECH Center on the illustrative map, but I can’t confirm services or hours.', sourceResourceIds: ['res-tech'] },
  { id: 'as-social', keywords: ['friend', 'meet', 'lonely', 'hang', 'eat', 'food', 'club', 'organization'], response: 'To meet people, try Community groups, Events, or browse demo organizations. The student-center entry and a peer tip list are below (the peer tips are student-submitted, not official).', sourceResourceIds: ['res-student-center', 'res-peer-tips'] },
]

export const FALLBACK: AssistantScript = {
  id: 'as-fallback',
  keywords: [],
  response: 'I’m a scripted demo and don’t have a verified answer for that. Try the Resources directory, or rephrase using words like advising, career, wellness, financial aid or tech help. I won’t guess at policies, hours or contacts.',
  sourceResourceIds: [],
}

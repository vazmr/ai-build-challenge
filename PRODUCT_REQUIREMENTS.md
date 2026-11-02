# Product Requirements

## 1. Product overview

**Product name:** Temple Student Hub  
**Tagline:** The campus experience, connected.

Temple Student Hub is a centralized digital community for Temple students to discover people, connect through shared interests, engage with organizations, find resources, participate in campus life and collaborate on projects.

### Core problem

Information about student life, organizations, events, resources and opportunities is spread across social media, websites, group chats, campus channels and word of mouth. Students can miss opportunities because they do not know where to look or how to stay connected. Student organizations and campus departments also face challenges reaching students and maintaining engagement.

### How might we

How might we make it easier for Temple students to discover opportunities, build meaningful connections and actively participate in the university community?

## 2. Product principles

1. **Connection over information overload.** Help students move from discovery to participation.
2. **One connected experience.** Features should work together rather than feel like unrelated mini-apps.
3. **Student identity matters.** Profiles should express personality, interests and creative work—not just function as resumes.
4. **Participation should be accessible.** Do not assume students attend fairs, know the right people or already belong to organizations.
5. **Privacy by design.** Private messages, files and membership records must not leak into public discovery.
6. **Meaningful metrics only.** Do not use popularity metrics as a proxy for contribution.
7. **Trust and transparency.** Clearly distinguish fictional/demo content, student-submitted content and verified official information.
8. **Build for replacement.** Prototype storage must be replaceable without rewriting feature UI.

## 3. Primary users

### Current Temple students
Need to discover events, communities, organizations, resources and peers; express their interests; and participate in campus life.

### Student organization members and officers
Need organization information, member communication, applications, role management, events, announcements and collaboration with other organizations.

### Student project creators and collaborators
Need to find peer help, recruit collaborators, coordinate work and document contributions.

### Institutional stakeholders
University departments and administrators may eventually use the platform to communicate opportunities and resources. They are not the primary prototype users.

Alumni are a possible future audience, not an MVP audience.

## 4. Simulated roles and permissions

The prototype must support switching among demo accounts:

- Jordan — General Student
- Taylor — Organization Member
- Morgan — Organization Officer
- Alex — Organization Administrator

A student can hold different roles in multiple organizations. Organization roles are scoped to the relevant organization; a role in one organization must not grant permissions in another.

The prototype simulates authentication. It must not collect or store passwords.

## 5. Core experience

The primary navigation destinations are:

1. Map
2. Events
3. Feed
4. Community
5. Projects

The Feed is the default landing view and the emphasized center navigation item.

Global header actions:
- My Campus Calendar
- Announcements
- Notifications
- More menu

More menu:
- My Profile
- Resources
- Saved Items
- Settings & Privacy

Organizations are discoverable through the broader experience and have dedicated organization profiles/workspaces. Resources and the AI Campus Assistant are accessible through the More menu or contextual entry points.

## 6. Platform and responsive requirements

One responsive web application:
- **Mobile:** primary everyday engagement experience.
- **Tablet:** browsing, content creation and organization management.
- **Desktop:** project collaboration, organization administration and larger workspaces.

Do not build separate mobile and desktop apps. Adapt layout and navigation to viewport size.

## 7. Prototype boundaries

### In scope
- Responsive navigation and core page layouts.
- Fictional sample content.
- Simulated account/role switching.
- Feed browsing and basic interactions.
- Event discovery, saving and simulated RSVP.
- Map with illustrative sample locations and pins.
- Open interest-based communities and discussion threads.
- Project discovery, creation and simulated team workspace.
- Student profiles, blog, collections and portfolio.
- Organization profiles and role-based workspace screens.
- Resource directory and simulated AI assistant responses.
- LocalStorage persistence and reset/reseed behavior.

### Out of scope for the initial prototype
- Real Temple single sign-on or student verification.
- Live Temple directory, OwlConnect or university-system integration.
- Real event ticketing or registration.
- Real maps/location tracking or live food-cart wait times.
- Cross-device synchronization or real-time collaboration.
- Production messaging, file hosting or push notifications.
- Production AI model integration.
- Supabase implementation.
- Payments, bidding or paid freelance services.

## 8. Trust, safety and privacy requirements

- Label all fictional sample data as demo content where context could cause confusion.
- Never claim a demo organization is officially recognized or verified.
- Keep private project workspaces, organization channels, member records and direct messages private.
- Following does not grant access to private content.
- Joining a project requires an explicit request and owner approval.
- Use report/block affordances in relevant community surfaces.
- Do not surface private messages, files or membership records in recommendations.
- Account-changing actions require confirmation.
- Do not invent Temple policies, resource eligibility, office hours or contact details.
- Academic collaboration features must not facilitate cheating.

-- Dados de demonstração do Temple Student Hub (TODO o conteúdo é fictício).
-- Gerado por supabase/scripts/generate-seed.mjs a partir de src/data/seed. Idempotente: limpa e recarrega.

truncate table assistant_scripts, campus_places, resources, conversation_participants, messages, conversations, collection_items, collections, portfolio_items, project_files, project_milestones, project_tasks, project_join_requests, project_memberships, projects, founding_checklist, founding_founders, founding_workspaces, thread_replies, discussion_threads, community_memberships, communities, event_participations, events, notifications, saved_items, blocks, hidden_posts, follows, comments, posts, announcements, collaboration_activity, collaboration_files, organization_collaborations, organization_interests, inquiry_replies, organization_inquiries, organization_invitations, organization_applications, organization_memberships, organizations, demo_accounts, students restart identity cascade;

-- students (10)
insert into students (id, display_name, major, college, class_year, bio, avatar_url, cover_url, interests, skills, theme, section_order, privacy, created_at, updated_at) values
  ('stu-jordan', 'Jordan', 'Communication Studies', 'Klein College', '2028', 'Communication major exploring clubs and campus life.', 'https://images.unsplash.com/photo-1611695434369-a8f5d76ceb7b?auto=format&fit=crop&crop=faces&w=160&h=160&q=75', 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1600&h=420&q=75', array['music', 'photography', 'career']::text[], array['video editing', 'social media']::text[], null, null, '{"overview":"temple-only","blog":"public","collections":"public","portfolio":"public","collaborations":"temple-only","about":"public"}'::jsonb, '2026-11-01T12:00:00.000Z'::timestamptz, '2026-11-01T12:00:00.000Z'::timestamptz),
  ('stu-taylor', 'Taylor', 'Computer Science', 'College of Science', '2028', 'Hackathon regular and Film Collective member.', 'https://images.unsplash.com/photo-1741354035032-eff737bfd35c?auto=format&fit=crop&crop=faces&w=160&h=160&q=75', null, array['tech', 'gaming', 'study']::text[], array['React', 'TypeScript']::text[], null, null, '{"overview":"temple-only","blog":"public","collections":"public","portfolio":"public","collaborations":"temple-only","about":"public"}'::jsonb, '2026-11-01T12:00:00.000Z'::timestamptz, '2026-11-01T12:00:00.000Z'::timestamptz),
  ('stu-morgan', 'Morgan', 'Business', 'Business School', '2026', 'Business major who helps run student organizations.', 'https://images.unsplash.com/photo-1757744705465-ea08b0ddc38a?auto=format&fit=crop&crop=faces&w=160&h=160&q=75', null, array['entrepreneurship', 'career', 'film']::text[], array['budgeting', 'event planning']::text[], null, null, '{"overview":"temple-only","blog":"public","collections":"public","portfolio":"public","collaborations":"temple-only","about":"public"}'::jsonb, '2026-11-01T12:00:00.000Z'::timestamptz, '2026-11-01T12:00:00.000Z'::timestamptz),
  ('stu-alex', 'Alex', 'Film & Media Arts', 'Arts College', '2027', 'Film major and president of the Film Collective.', 'https://images.unsplash.com/photo-1525457136159-8878648a7ad0?auto=format&fit=crop&crop=faces&w=160&h=160&q=75', null, array['film', 'art', 'student-life']::text[], array['directing', 'cinematography']::text[], null, null, '{"overview":"temple-only","blog":"public","collections":"public","portfolio":"public","collaborations":"temple-only","about":"public"}'::jsonb, '2026-11-01T12:00:00.000Z'::timestamptz, '2026-11-01T12:00:00.000Z'::timestamptz),
  ('stu-riley', 'Riley', 'Visual Arts', null, '2027', 'Street photographer exploring Philly.', 'https://images.unsplash.com/photo-1604177091072-b7b677a077f6?auto=format&fit=crop&crop=faces&w=160&h=160&q=75', null, array['photography', 'art', 'philly']::text[], array['photography', 'Lightroom']::text[], null, null, '{"overview":"temple-only","blog":"public","collections":"public","portfolio":"public","collaborations":"temple-only","about":"public"}'::jsonb, '2026-11-01T12:00:00.000Z'::timestamptz, '2026-11-01T12:00:00.000Z'::timestamptz),
  ('stu-sam', 'Sam', 'Music Technology', null, '2029', 'Producer and podcast host.', 'https://images.unsplash.com/photo-1546525848-3ce03ca516f6?auto=format&fit=crop&crop=faces&w=160&h=160&q=75', null, array['music', 'tech']::text[], array['audio mixing', 'Ableton']::text[], null, null, '{"overview":"temple-only","blog":"public","collections":"public","portfolio":"public","collaborations":"temple-only","about":"public"}'::jsonb, '2026-11-01T12:00:00.000Z'::timestamptz, '2026-11-01T12:00:00.000Z'::timestamptz),
  ('stu-casey', 'Casey', 'Fashion Design', null, '2027', 'Thrift flips and zine making.', 'https://images.unsplash.com/photo-1607990283143-e81e7a2c9349?auto=format&fit=crop&crop=faces&w=160&h=160&q=75', null, array['fashion', 'art', 'philly']::text[], array['sewing', 'illustration']::text[], null, null, '{"overview":"temple-only","blog":"public","collections":"public","portfolio":"public","collaborations":"temple-only","about":"public"}'::jsonb, '2026-11-01T12:00:00.000Z'::timestamptz, '2026-11-01T12:00:00.000Z'::timestamptz),
  ('stu-devon', 'Devon', 'Information Science', null, '2028', 'Game jams and tiny apps.', 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?auto=format&fit=crop&crop=faces&w=160&h=160&q=75', null, array['gaming', 'tech']::text[], array['Unity', 'Python']::text[], null, null, '{"overview":"temple-only","blog":"public","collections":"public","portfolio":"public","collaborations":"temple-only","about":"public"}'::jsonb, '2026-11-01T12:00:00.000Z'::timestamptz, '2026-11-01T12:00:00.000Z'::timestamptz),
  ('stu-priya', 'Priya', 'Entrepreneurship', null, '2027', 'Building a snack startup between classes.', 'https://images.unsplash.com/photo-1662850886700-4ec19bd30d11?auto=format&fit=crop&crop=faces&w=160&h=160&q=75', null, array['entrepreneurship', 'career', 'study']::text[], array['pitching', 'market research']::text[], null, null, '{"overview":"temple-only","blog":"public","collections":"public","portfolio":"public","collaborations":"temple-only","about":"public"}'::jsonb, '2026-11-01T12:00:00.000Z'::timestamptz, '2026-11-01T12:00:00.000Z'::timestamptz),
  ('stu-marcus', 'Marcus', 'Kinesiology', null, '2029', 'Runner. Always up for a pickup game.', 'https://images.unsplash.com/photo-1624918479892-3e5df2910410?auto=format&fit=crop&crop=faces&w=160&h=160&q=75', null, array['student-life', 'philly']::text[], array['coaching']::text[], null, null, '{"overview":"temple-only","blog":"public","collections":"public","portfolio":"public","collaborations":"temple-only","about":"public"}'::jsonb, '2026-11-01T12:00:00.000Z'::timestamptz, '2026-11-01T12:00:00.000Z'::timestamptz);

-- demo_accounts (4)
insert into demo_accounts (id, profile_id, display_name, is_default) values
  ('acct-jordan', 'stu-jordan', 'Jordan', true),
  ('acct-taylor', 'stu-taylor', 'Taylor', false),
  ('acct-morgan', 'stu-morgan', 'Morgan', false),
  ('acct-alex', 'stu-alex', 'Alex', false);

-- organizations (3)
insert into organizations (id, name, description, tags, verification_status, created_at, updated_at) values
  ('org-film', 'Film Collective', 'Student filmmakers making short films and hosting screening nights.', array['film', 'art']::text[], 'demo', '2026-11-01T12:00:00.000Z'::timestamptz, '2026-11-01T12:00:00.000Z'::timestamptz),
  ('org-founders', 'Founders Circle', 'Students building startups with pitch practice, workshops and peer feedback.', array['entrepreneurship', 'career']::text[], 'demo', '2026-11-01T12:00:00.000Z'::timestamptz, '2026-11-01T12:00:00.000Z'::timestamptz),
  ('org-radio', 'Campus Radio', 'Student-run radio with live shows, DJ sets and music events.', array['music']::text[], 'demo', '2026-11-01T12:00:00.000Z'::timestamptz, '2026-11-01T12:00:00.000Z'::timestamptz);

-- organization_memberships (6)
insert into organization_memberships (id, organization_id, student_id, role, status, permissions, joined_at) values
  ('mem-1', 'org-film', 'stu-alex', 'president', 'active', array['org.view-members', 'org.review-applications', 'org.manage-members', 'org.access-board', 'org.manage-invitations', 'org.read-inquiries', 'org.post-announcements', 'org.manage-events']::text[], '2026-11-01T12:00:00.000Z'::timestamptz),
  ('mem-2', 'org-film', 'stu-morgan', 'vice-president', 'active', array['org.view-members', 'org.review-applications', 'org.manage-members', 'org.access-board', 'org.manage-invitations', 'org.read-inquiries', 'org.post-announcements', 'org.manage-events']::text[], '2026-11-01T12:00:00.000Z'::timestamptz),
  ('mem-3', 'org-film', 'stu-taylor', 'member', 'active', array['org.view-members']::text[], '2026-11-01T12:00:00.000Z'::timestamptz),
  ('mem-4', 'org-founders', 'stu-morgan', 'treasurer', 'active', array['org.view-members', 'org.access-board']::text[], '2026-11-01T12:00:00.000Z'::timestamptz),
  ('mem-5', 'org-founders', 'stu-alex', 'member', 'active', array['org.view-members']::text[], '2026-11-01T12:00:00.000Z'::timestamptz),
  ('mem-6', 'org-radio', 'stu-sam', 'president', 'active', array['org.view-members', 'org.review-applications', 'org.manage-members', 'org.access-board', 'org.manage-invitations', 'org.read-inquiries', 'org.post-announcements', 'org.manage-events']::text[], '2026-11-01T12:00:00.000Z'::timestamptz);

-- organization_applications (1)
insert into organization_applications (id, organization_id, student_id, message, status, created_at) values
  ('app-1', 'org-film', 'stu-jordan', 'I edit video and would love to help with post-production.', 'pending', '2026-11-04T13:00:00-05:00'::timestamptz);

-- organization_invitations (1)
insert into organization_invitations (id, organization_id, student_id, invited_by_id, status, created_at) values
  ('inv-1', 'org-founders', 'stu-taylor', 'stu-morgan', 'pending', '2026-11-03T16:00:00-05:00'::timestamptz);

-- organization_inquiries (1)
insert into organization_inquiries (id, organization_id, student_id, subject, body, status, assigned_to_id, created_at) values
  ('inq-1', 'org-film', 'stu-jordan', 'Do I need my own camera?', 'Thinking about joining. Is equipment provided for members?', 'new', null, '2026-11-04T10:30:00-05:00'::timestamptz);

-- organization_collaborations (1)
insert into organization_collaborations (id, org_a_id, org_b_id, status, project_title, created_at) values
  ('collab-1', 'org-radio', 'org-film', 'pending', 'Joint Screening + Live Soundtrack Night', '2026-11-04T15:00:00-05:00'::timestamptz);

-- collaboration_activity (1)
insert into collaboration_activity (id, collaboration_id, organization_id, text, at) values
  ('act-1', 'collab-1', 'org-radio', 'Invited Film Collective to collaborate', '2026-11-04T15:00:00-05:00'::timestamptz);

-- announcements (3)
insert into announcements (id, organization_id, author_id, title, body, pinned, created_at) values
  ('ann-1', null, null, 'Welcome to Temple Student Hub', 'Find events, join communities, start projects and connect with organizations across campus.', true, '2026-11-01T09:00:00-05:00'::timestamptz),
  ('ann-2', 'org-film', 'stu-alex', 'Screening night next week', 'Bring a short film (under 10 minutes) to share. Everyone is welcome.', true, '2026-11-03T12:00:00-05:00'::timestamptz),
  ('ann-3', 'org-radio', 'stu-sam', 'Open slots for guest DJs', 'Interested in a guest set? Ask a question from our page.', false, '2026-11-02T12:00:00-05:00'::timestamptz);

-- posts (28)
insert into posts (id, author_id, organization_id, type, title, body, media_label, media_urls, audio_url, link_url, is_draft, pinned, related_id, tags, visibility, created_at, updated_at) values
  ('post-1', 'stu-riley', null, 'photo', 'Morning on Broad Street', 'Shot this on my walk to class. Film grain on purpose.', 'Photo: Broad Street at sunrise', array['https://images.unsplash.com/photo-1526590916886-c918f193794d?auto=format&fit=crop&w=1200&q=75']::text[], null, null, false, false, null, array['photography', 'philly']::text[], 'public', '2026-11-05T09:10:00-05:00'::timestamptz, '2026-11-05T09:10:00-05:00'::timestamptz),
  ('post-2', 'stu-sam', 'org-radio', 'event', 'WHIP Radio Live', 'Three hours of student DJs, live. Come hang out.', null, '{}'::text[], null, null, false, false, 'ev-whip', array['music', 'student-life']::text[], 'public', '2026-11-04T17:30:00-05:00'::timestamptz, '2026-11-04T17:30:00-05:00'::timestamptz),
  ('post-3', 'stu-taylor', null, 'discussion', 'What do you use to stay focused during finals?', 'Library, coffee shop, or locked in at home? Trying to build a routine.', null, '{}'::text[], null, null, false, false, null, array['study', 'student-life']::text[], 'public', '2026-11-04T14:00:00-05:00'::timestamptz, '2026-11-04T14:00:00-05:00'::timestamptz),
  ('post-4', 'stu-alex', 'org-film', 'project', 'Looking for a sound designer', 'Our short film "Night Shift" needs someone for sound design. Details in the project.', null, '{}'::text[], null, null, false, false, 'proj-4', array['film', 'art']::text[], 'public', '2026-11-03T19:00:00-05:00'::timestamptz, '2026-11-03T19:00:00-05:00'::timestamptz),
  ('post-5', 'stu-sam', null, 'audio', 'Beat sketch #12', 'Rough loop, feedback welcome.', 'Audio: 1:48 beat sketch', array['https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?auto=format&fit=crop&w=1200&q=75']::text[], 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', null, false, false, null, array['music']::text[], 'public', '2026-11-03T11:20:00-05:00'::timestamptz, '2026-11-03T11:20:00-05:00'::timestamptz),
  ('post-6', 'stu-morgan', null, 'text', null, 'Reminder: pitch practice night is next week. No experience needed, just bring an idea.', null, '{}'::text[], null, null, false, false, null, array['entrepreneurship', 'career']::text[], 'public', '2026-11-03T09:00:00-05:00'::timestamptz, '2026-11-03T09:00:00-05:00'::timestamptz),
  ('post-7', 'stu-alex', null, 'video', 'Behind the scenes: lighting test', 'Testing a one-light setup for the short.', 'Video: 0:45 lighting test', array['https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?auto=format&fit=crop&w=1200&q=75']::text[], null, null, false, false, null, array['film']::text[], 'public', '2026-11-02T16:45:00-05:00'::timestamptz, '2026-11-02T16:45:00-05:00'::timestamptz),
  ('post-8', 'stu-riley', null, 'quote', 'A line I keep coming back to', '"The best camera is the one that''s with you."', null, '{}'::text[], null, 'https://example.com/quote-source', false, false, null, array['photography', 'art']::text[], 'public', '2026-11-02T12:10:00-05:00'::timestamptz, '2026-11-02T12:10:00-05:00'::timestamptz),
  ('post-9', 'stu-taylor', null, 'link', 'Free intro to TypeScript course', 'Worked through this over the weekend. Good for beginners.', null, '{}'::text[], null, 'https://example.com/typescript-intro', false, false, null, array['tech', 'study']::text[], 'public', '2026-11-01T20:00:00-05:00'::timestamptz, '2026-11-01T20:00:00-05:00'::timestamptz),
  ('post-10', 'stu-morgan', 'org-founders', 'organization', 'Founders Circle is open to new members', 'We are welcoming new members this semester. Ask a question or request to join from our page.', null, '{}'::text[], null, null, false, false, 'org-founders', array['entrepreneurship']::text[], 'public', '2026-11-01T10:00:00-05:00'::timestamptz, '2026-11-01T10:00:00-05:00'::timestamptz),
  ('post-11', 'stu-sam', null, 'project', 'Student Podcast Pilot needs a co-host', 'Weekly show about campus creators. Looking for a second voice.', null, '{}'::text[], null, null, false, false, 'proj-2', array['music', 'student-life']::text[], 'public', '2026-10-31T15:00:00-05:00'::timestamptz, '2026-10-31T15:00:00-05:00'::timestamptz),
  ('post-12', 'stu-riley', null, 'album', 'Fall colors, Main Campus', 'Six frames from last weekend.', 'Album: 6 photos', array['https://images.unsplash.com/photo-1699155759495-855eaf21cfde?auto=format&fit=crop&w=1200&q=75', 'https://images.unsplash.com/photo-1670528148572-9270351b95bd?auto=format&fit=crop&w=1200&q=75', 'https://images.unsplash.com/photo-1638616110725-a0765049a544?auto=format&fit=crop&w=1200&q=75', 'https://images.unsplash.com/photo-1669455257486-1156934066db?auto=format&fit=crop&w=1200&q=75', 'https://images.unsplash.com/photo-1762572336330-726cdf5ff954?auto=format&fit=crop&w=1200&q=75', 'https://images.unsplash.com/photo-1792299444661-6902cb29d8dd?auto=format&fit=crop&w=1200&q=75']::text[], null, null, false, false, null, array['photography', 'student-life']::text[], 'public', '2026-10-30T13:30:00-05:00'::timestamptz, '2026-10-30T13:30:00-05:00'::timestamptz),
  ('post-13', 'stu-jordan', null, 'text', 'Draft: thoughts on my first semester', 'Private draft, only visible to me.', null, '{}'::text[], null, null, false, false, null, array['student-life']::text[], 'private', '2026-10-29T21:00:00-05:00'::timestamptz, '2026-10-29T21:00:00-05:00'::timestamptz),
  ('post-14', 'stu-jordan', null, 'text', null, 'Anyone want to start a casual photo walk group? Philly has so many spots.', null, '{}'::text[], null, null, false, false, null, array['photography', 'philly']::text[], 'public', '2026-10-28T18:00:00-05:00'::timestamptz, '2026-10-28T18:00:00-05:00'::timestamptz),
  ('post-15', 'stu-casey', null, 'album', 'Thrift haul and what I made from it', 'Five pieces, $23 total.', 'Album: 5 outfits', array['https://images.unsplash.com/photo-1619161519929-befcb28d6384?auto=format&fit=crop&w=1200&q=75', 'https://images.unsplash.com/photo-1624192647570-1131acc12ccf?auto=format&fit=crop&w=1200&q=75', 'https://images.unsplash.com/photo-1759630814559-f9fffe187384?auto=format&fit=crop&w=1200&q=75', 'https://images.unsplash.com/photo-1642359730306-4e80ff12ff6d?auto=format&fit=crop&w=1200&q=75', 'https://images.unsplash.com/photo-1717201395289-03e4700ca8b6?auto=format&fit=crop&w=1200&q=75']::text[], null, null, false, false, null, array['fashion', 'art']::text[], 'public', '2026-11-05T08:00:00-05:00'::timestamptz, '2026-11-05T08:00:00-05:00'::timestamptz),
  ('post-16', 'stu-devon', null, 'video', '30-second game jam recap', 'We built a platformer in 48 hours. Rough, but ours.', 'Video: 0:30 recap', array['https://images.unsplash.com/photo-1640955014216-75201056c829?auto=format&fit=crop&w=1200&q=75']::text[], null, null, false, false, null, array['gaming', 'tech']::text[], 'public', '2026-11-04T23:10:00-05:00'::timestamptz, '2026-11-04T23:10:00-05:00'::timestamptz),
  ('post-17', 'stu-priya', null, 'discussion', 'How do you validate an idea before building it?', 'Surveys, interviews, or a quick landing page? What worked for you?', null, '{}'::text[], null, null, false, false, null, array['entrepreneurship', 'career']::text[], 'public', '2026-11-04T19:30:00-05:00'::timestamptz, '2026-11-04T19:30:00-05:00'::timestamptz),
  ('post-18', 'stu-marcus', null, 'text', null, 'Pickup basketball Thursday at 7. All levels welcome, bring water.', null, '{}'::text[], null, null, false, false, null, array['student-life']::text[], 'public', '2026-11-04T16:20:00-05:00'::timestamptz, '2026-11-04T16:20:00-05:00'::timestamptz),
  ('post-19', 'stu-casey', null, 'project', 'Campus Style Zine is recruiting', 'Need photographers and a layout person for issue 2.', null, '{}'::text[], null, null, false, false, 'proj-5', array['fashion', 'photography']::text[], 'public', '2026-11-03T21:00:00-05:00'::timestamptz, '2026-11-03T21:00:00-05:00'::timestamptz),
  ('post-20', 'stu-riley', null, 'quote', 'Writing this on my desk', '"Make something every day, even if it is small."', null, '{}'::text[], null, 'https://example.com/another-quote', false, false, null, array['art']::text[], 'public', '2026-11-03T07:45:00-05:00'::timestamptz, '2026-11-03T07:45:00-05:00'::timestamptz),
  ('post-21', 'stu-sam', null, 'resource', 'Quiet study spots (student tips)', 'A short list of student-submitted tips. Not official information.', null, '{}'::text[], null, null, false, false, 'res-peer-tips', array['study', 'student-life']::text[], 'public', '2026-11-02T20:15:00-05:00'::timestamptz, '2026-11-02T20:15:00-05:00'::timestamptz),
  ('post-22', 'stu-devon', null, 'audio', 'Chiptune loop for the jam', 'Free to use if you credit me.', 'Audio: 1:12 chiptune loop', array['https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?auto=format&fit=crop&w=1200&q=75']::text[], 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', null, false, false, null, array['music', 'gaming']::text[], 'public', '2026-11-02T14:05:00-05:00'::timestamptz, '2026-11-02T14:05:00-05:00'::timestamptz),
  ('post-23', 'stu-priya', 'org-founders', 'event', 'Startup Pitch Night', 'Practice a 3-minute pitch and get friendly feedback.', null, '{}'::text[], null, null, false, false, 'ev-pitch', array['entrepreneurship']::text[], 'public', '2026-11-02T10:00:00-05:00'::timestamptz, '2026-11-02T10:00:00-05:00'::timestamptz),
  ('post-24', 'stu-marcus', null, 'photo', 'Sunrise run, campus loop', 'Cold, quiet, perfect.', 'Photo: campus loop at sunrise', array['https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&w=1200&q=75']::text[], null, null, false, false, null, array['philly', 'student-life']::text[], 'public', '2026-11-01T07:30:00-05:00'::timestamptz, '2026-11-01T07:30:00-05:00'::timestamptz),
  ('post-25', 'stu-taylor', null, 'text', null, 'Hack night next week. Beginners welcome, I will help you set up your environment.', null, '{}'::text[], null, null, false, false, null, array['tech', 'study']::text[], 'public', '2026-10-31T18:00:00-05:00'::timestamptz, '2026-10-31T18:00:00-05:00'::timestamptz),
  ('post-26', 'stu-alex', 'org-film', 'organization', 'Film Collective: screening night recap', 'Thanks to everyone who shared a short. See our page for what is next.', null, '{}'::text[], null, null, false, false, 'org-film', array['film']::text[], 'public', '2026-10-30T22:00:00-05:00'::timestamptz, '2026-10-30T22:00:00-05:00'::timestamptz),
  ('post-27', 'stu-casey', null, 'photo', 'Zine cover draft', 'Which colorway reads better in print?', 'Photo: zine cover draft', array['https://images.unsplash.com/photo-1525247663235-1d5a3ae627fd?auto=format&fit=crop&w=1200&q=75']::text[], null, null, false, false, null, array['fashion', 'art']::text[], 'public', '2026-10-30T11:00:00-05:00'::timestamptz, '2026-10-30T11:00:00-05:00'::timestamptz),
  ('post-28', 'stu-morgan', null, 'link', 'Budgeting template for student orgs', 'A simple spreadsheet structure I use. Adapt freely.', null, '{}'::text[], null, 'https://example.com/budget-template', false, false, null, array['entrepreneurship', 'career']::text[], 'public', '2026-10-29T12:00:00-05:00'::timestamptz, '2026-10-29T12:00:00-05:00'::timestamptz);

-- comments (5)
insert into comments (id, post_id, author_id, body, created_at) values
  ('com-1', 'post-3', 'stu-riley', 'Charles Library 4th floor, every time.', '2026-11-04T15:00:00-05:00'::timestamptz),
  ('com-2', 'post-1', 'stu-alex', 'That light is unreal.', '2026-11-05T09:40:00-05:00'::timestamptz),
  ('com-3', 'post-15', 'stu-riley', 'The second outfit is amazing.', '2026-11-05T08:30:00-05:00'::timestamptz),
  ('com-4', 'post-17', 'stu-morgan', 'Landing page plus 5 interviews worked for us.', '2026-11-04T20:00:00-05:00'::timestamptz),
  ('com-5', 'post-16', 'stu-taylor', 'Playable?! Link please.', '2026-11-05T00:10:00-05:00'::timestamptz);

-- follows (11)
insert into follows (id, follower_id, target_type, target_id, created_at) values
  ('fol-1', 'stu-jordan', 'student', 'stu-riley', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('fol-2', 'stu-jordan', 'organization', 'org-radio', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('fol-3', 'stu-taylor', 'student', 'stu-sam', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('fol-4', 'stu-morgan', 'organization', 'org-film', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('fol-5', 'stu-alex', 'student', 'stu-riley', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('fol-6', 'stu-jordan', 'student', 'stu-sam', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('fol-7', 'stu-jordan', 'community', 'com-photo', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('fol-8', 'stu-taylor', 'student', 'stu-devon', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('fol-9', 'stu-taylor', 'organization', 'org-founders', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('fol-10', 'stu-morgan', 'student', 'stu-priya', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('fol-11', 'stu-alex', 'student', 'stu-casey', '2026-11-01T12:00:00.000Z'::timestamptz);

-- notifications (3)
insert into notifications (id, student_id, title, body, link, read, created_at) values
  ('not-1', 'stu-jordan', 'Welcome', 'Explore the Feed, Events and Projects to get started.', '/feed', false, '2026-11-01T09:05:00-05:00'::timestamptz),
  ('not-2', 'stu-taylor', 'Invitation from Founders Circle', 'Morgan invited you to join.', '/organizations/org-founders', false, '2026-11-03T16:00:00-05:00'::timestamptz),
  ('not-3', 'stu-taylor', 'New join request', 'Morgan asked to help on Portfolio site feedback.', '/projects/proj-3', false, '2026-11-04T09:00:00-05:00'::timestamptz);

-- events (18)
insert into events (id, title, description, host_organization_id, category, start_at, end_at, location_name, price_label, cover_url, campus, status) values
  ('ev-today', 'Study Break & Free Pizza', 'Take a break between classes.', 'org-founders', 'Food & Freebies', '2026-11-05T12:00:00-05:00'::timestamptz, '2026-11-05T13:30:00-05:00'::timestamptz, 'Howard Gittis Student Center', 'Free', 'https://images.unsplash.com/photo-1724232860199-ca42e61ddb43?auto=format&fit=crop&w=1400&q=75', 'Main Campus', 'published'),
  ('ev-whip', 'WHIP Radio Live', 'Student DJs broadcast live.', 'org-radio', 'Music & Entertainment', '2026-11-06T18:00:00-05:00'::timestamptz, '2026-11-06T21:00:00-05:00'::timestamptz, 'Howard Gittis Student Center', 'Free', null, 'Main Campus', 'published'),
  ('ev-art', 'Student Art Showcase', 'An afternoon of student work across media.', null, 'Arts & Culture', '2026-11-07T12:00:00-05:00'::timestamptz, '2026-11-07T16:00:00-05:00'::timestamptz, 'Charles Library', 'Free', 'https://images.unsplash.com/photo-1738391788925-d130a4993d50?auto=format&fit=crop&w=1400&q=75', 'Main Campus', 'published'),
  ('ev-producers', 'Music Producers Meetup', 'Share beats, swap tips, find collaborators.', 'org-radio', 'Music & Entertainment', '2026-11-09T17:30:00-05:00'::timestamptz, '2026-11-09T19:00:00-05:00'::timestamptz, 'TECH Center', 'Free', null, 'Main Campus', 'published'),
  ('ev-careers', 'Creative Careers & Networking', 'Meet students and alumni in creative fields.', null, 'Professional', '2026-11-11T15:00:00-05:00'::timestamptz, '2026-11-11T17:00:00-05:00'::timestamptz, 'Annenberg Hall', 'Free', null, 'Main Campus', 'published'),
  ('ev-hack', 'Intro to Hack Night', 'Build something small with other students. Beginners welcome.', null, 'Academic', '2026-11-12T18:00:00-05:00'::timestamptz, '2026-11-12T21:00:00-05:00'::timestamptz, 'TECH Center', 'Free', null, 'Main Campus', 'published'),
  ('ev-mic', 'Open Mic Night', 'Music, poetry and comedy.', null, 'Social', '2026-11-13T19:00:00-05:00'::timestamptz, '2026-11-13T21:30:00-05:00'::timestamptz, 'Tuttleman Learning Center', '$5', 'https://images.unsplash.com/photo-1764032760868-dced31a72fb4?auto=format&fit=crop&w=1400&q=75', 'Main Campus', 'published'),
  ('ev-cleanup', 'Neighborhood Cleanup Day', 'Volunteer with other students.', null, 'Community Service', '2026-11-14T10:00:00-05:00'::timestamptz, '2026-11-14T13:00:00-05:00'::timestamptz, 'Meet at Howard Gittis Student Center', 'Free', 'https://images.unsplash.com/photo-1565803974275-dccd2f933cbb?auto=format&fit=crop&w=1400&q=75', 'Main Campus', 'published'),
  ('ev-5k', 'Fall Fun Run', 'A casual 5K around campus.', null, 'Sports & Recreation', '2026-11-15T09:00:00-05:00'::timestamptz, '2026-11-15T11:00:00-05:00'::timestamptz, 'Campus loop', 'Free', 'https://images.unsplash.com/photo-1570004119777-2b1786b0e5bd?auto=format&fit=crop&w=1400&q=75', 'Main Campus', 'published'),
  ('ev-past', 'Fall Welcome Mixer', 'A casual mixer to kick off the fall semester.', null, 'Social', '2026-10-20T17:00:00-05:00'::timestamptz, '2026-10-20T19:00:00-05:00'::timestamptz, 'Howard Gittis Student Center', 'Free', 'https://images.unsplash.com/photo-1568571293333-566f5f278d19?auto=format&fit=crop&w=1400&q=75', 'Main Campus', 'published'),
  ('ev-gym', 'Open Gym Night', 'Pickup basketball and volleyball.', null, 'Sports & Recreation', '2026-11-06T19:00:00-05:00'::timestamptz, '2026-11-06T21:00:00-05:00'::timestamptz, 'Howard Gittis Student Center', 'Free', 'https://images.unsplash.com/photo-1519432473078-0151c4f90335?auto=format&fit=crop&w=1400&q=75', 'Main Campus', 'published'),
  ('ev-resume', 'Resume Clinic', 'Drop in for friendly resume feedback from peers.', null, 'Professional', '2026-11-10T14:00:00-05:00'::timestamptz, '2026-11-10T16:00:00-05:00'::timestamptz, 'Annenberg Hall', 'Free', null, 'Main Campus', 'published'),
  ('ev-game', 'Game Night Tournament', 'Board games and console brackets.', null, 'Social', '2026-11-16T18:00:00-05:00'::timestamptz, '2026-11-16T21:00:00-05:00'::timestamptz, 'TECH Center', 'Free', null, 'Main Campus', 'published'),
  ('ev-swap', 'Fashion Swap', 'Bring something, take something.', null, 'Arts & Culture', '2026-11-17T12:00:00-05:00'::timestamptz, '2026-11-17T15:00:00-05:00'::timestamptz, 'Howard Gittis Student Center', 'Free', 'https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?auto=format&fit=crop&w=1400&q=75', 'Main Campus', 'published'),
  ('ev-pitch', 'Startup Pitch Night', 'Practice a 3-minute pitch with friendly feedback.', 'org-founders', 'Professional', '2026-11-18T18:00:00-05:00'::timestamptz, '2026-11-18T20:30:00-05:00'::timestamptz, 'Tuttleman Learning Center', 'Free', null, 'Main Campus', 'published'),
  ('ev-jazz', 'Jazz on the Lawn', 'Live student jazz ensembles.', 'org-radio', 'Music & Entertainment', '2026-11-19T16:00:00-05:00'::timestamptz, '2026-11-19T18:00:00-05:00'::timestamptz, 'Campus lawn', 'Free', 'https://images.unsplash.com/photo-1764214918540-4467f7f1f1da?auto=format&fit=crop&w=1400&q=75', 'Main Campus', 'published'),
  ('ev-film', 'Student Film Screening Night', 'Short films by students.', 'org-film', 'Arts & Culture', '2026-11-20T19:00:00-05:00'::timestamptz, '2026-11-20T21:30:00-05:00'::timestamptz, 'Charles Library', 'Free', 'https://images.unsplash.com/photo-1485095329183-d0797cdc5676?auto=format&fit=crop&w=1400&q=75', 'Main Campus', 'published'),
  ('ev-study', 'Finals Study Jam', 'Quiet tables and snacks.', null, 'Academic', '2026-11-21T10:00:00-05:00'::timestamptz, '2026-11-21T17:00:00-05:00'::timestamptz, 'Charles Library', 'Free', null, 'Main Campus', 'published');

-- event_participations (51)
insert into event_participations (id, event_id, student_id, state, updated_at) values
  ('ep-1', 'ev-past', 'stu-taylor', 'attended', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-2', 'ev-past', 'stu-alex', 'attended', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-3', 'ev-past', 'stu-jordan', 'attended', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-4', 'ev-whip', 'stu-taylor', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-5', 'ev-pitch', 'stu-morgan', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-today-stu-riley', 'ev-today', 'stu-riley', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-today-stu-sam', 'ev-today', 'stu-sam', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-today-stu-marcus', 'ev-today', 'stu-marcus', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-today-stu-casey', 'ev-today', 'stu-casey', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-today-stu-priya', 'ev-today', 'stu-priya', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-whip-stu-sam', 'ev-whip', 'stu-sam', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-whip-stu-riley', 'ev-whip', 'stu-riley', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-whip-stu-casey', 'ev-whip', 'stu-casey', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-whip-stu-devon', 'ev-whip', 'stu-devon', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-whip-stu-marcus', 'ev-whip', 'stu-marcus', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-whip-stu-priya', 'ev-whip', 'stu-priya', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-art-stu-riley', 'ev-art', 'stu-riley', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-art-stu-casey', 'ev-art', 'stu-casey', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-art-stu-alex', 'ev-art', 'stu-alex', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-art-stu-morgan', 'ev-art', 'stu-morgan', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-producers-stu-sam', 'ev-producers', 'stu-sam', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-producers-stu-devon', 'ev-producers', 'stu-devon', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-careers-stu-priya', 'ev-careers', 'stu-priya', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-careers-stu-morgan', 'ev-careers', 'stu-morgan', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-careers-stu-taylor', 'ev-careers', 'stu-taylor', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-careers-stu-alex', 'ev-careers', 'stu-alex', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-careers-stu-devon', 'ev-careers', 'stu-devon', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-hack-stu-taylor', 'ev-hack', 'stu-taylor', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-hack-stu-devon', 'ev-hack', 'stu-devon', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-hack-stu-priya', 'ev-hack', 'stu-priya', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-mic-stu-sam', 'ev-mic', 'stu-sam', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-mic-stu-casey', 'ev-mic', 'stu-casey', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-mic-stu-riley', 'ev-mic', 'stu-riley', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-mic-stu-marcus', 'ev-mic', 'stu-marcus', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-mic-stu-alex', 'ev-mic', 'stu-alex', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-mic-stu-taylor', 'ev-mic', 'stu-taylor', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-mic-stu-devon', 'ev-mic', 'stu-devon', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-5k-stu-marcus', 'ev-5k', 'stu-marcus', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-pitch-stu-priya', 'ev-pitch', 'stu-priya', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-pitch-stu-alex', 'ev-pitch', 'stu-alex', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-pitch-stu-taylor', 'ev-pitch', 'stu-taylor', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-pitch-stu-devon', 'ev-pitch', 'stu-devon', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-pitch-stu-riley', 'ev-pitch', 'stu-riley', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-film-stu-alex', 'ev-film', 'stu-alex', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-film-stu-morgan', 'ev-film', 'stu-morgan', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-film-stu-taylor', 'ev-film', 'stu-taylor', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-film-stu-riley', 'ev-film', 'stu-riley', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-film-stu-casey', 'ev-film', 'stu-casey', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-film-stu-sam', 'ev-film', 'stu-sam', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-jazz-stu-sam', 'ev-jazz', 'stu-sam', 'going', '2026-11-01T12:00:00.000Z'::timestamptz),
  ('ep-ev-jazz-stu-riley', 'ev-jazz', 'stu-riley', 'going', '2026-11-01T12:00:00.000Z'::timestamptz);

-- communities (9)
insert into communities (id, name, description, category, tags, created_by_student_id, visibility, is_official_organization) values
  ('com-music', 'Music & Music Production', 'Share beats, gear questions and collaborations. Informal student group.', 'Music & Music Production', array['music', 'tech']::text[], 'stu-sam', 'open', false),
  ('com-film', 'Film & Media', 'Shoots, screenings and crew calls. Informal student group.', 'Film & Media', array['film', 'art']::text[], 'stu-alex', 'open', false),
  ('com-photo', 'Photography & Visual Arts', 'Photo walks, critiques and gear talk. Informal student group.', 'Photography & Visual Arts', array['photography', 'art']::text[], 'stu-riley', 'open', false),
  ('com-study', 'Study Groups', 'Find people to study with. Informal student group.', 'Study Groups', array['study']::text[], 'stu-taylor', 'open', false),
  ('com-gaming', 'Gaming', 'Casual play, tournaments and game nights. Informal student group.', 'Gaming', array['gaming']::text[], 'stu-taylor', 'open', false),
  ('com-philly', 'Philadelphia Events & Culture', 'What to do around the city. Informal student group.', 'Philadelphia Events & Culture', array['philly', 'student-life']::text[], 'stu-riley', 'open', false),
  ('com-fashion', 'Fashion & Style', 'Thrifting, upcycling and outfit feedback. Informal student group.', 'Fashion & Style', array['fashion', 'art']::text[], 'stu-casey', 'open', false),
  ('com-startup', 'Entrepreneurship', 'Idea swaps and pitch practice. Informal student group.', 'Entrepreneurship', array['entrepreneurship', 'career']::text[], 'stu-priya', 'open', false),
  ('com-life', 'Temple Student Life', 'Tips, questions and good finds around campus. Informal student group.', 'Temple Student Life', array['student-life']::text[], 'stu-marcus', 'open', false);

-- community_memberships (14)
insert into community_memberships (id, community_id, student_id, role, status) values
  ('cmem-1', 'com-music', 'stu-sam', 'founder', 'active'),
  ('cmem-2', 'com-film', 'stu-alex', 'founder', 'active'),
  ('cmem-3', 'com-photo', 'stu-riley', 'founder', 'active'),
  ('cmem-4', 'com-study', 'stu-taylor', 'founder', 'active'),
  ('cmem-5', 'com-gaming', 'stu-taylor', 'founder', 'active'),
  ('cmem-6', 'com-philly', 'stu-riley', 'founder', 'active'),
  ('cmem-7', 'com-photo', 'stu-jordan', 'participant', 'active'),
  ('cmem-8', 'com-music', 'stu-taylor', 'participant', 'active'),
  ('cmem-9', 'com-fashion', 'stu-casey', 'founder', 'active'),
  ('cmem-10', 'com-startup', 'stu-priya', 'founder', 'active'),
  ('cmem-11', 'com-life', 'stu-marcus', 'founder', 'active'),
  ('cmem-12', 'com-startup', 'stu-morgan', 'participant', 'active'),
  ('cmem-13', 'com-gaming', 'stu-devon', 'participant', 'active'),
  ('cmem-14', 'com-life', 'stu-jordan', 'participant', 'active');

-- discussion_threads (9)
insert into discussion_threads (id, community_id, author_id, kind, title, body, link_url, created_at) values
  ('thr-1', 'com-photo', 'stu-riley', null, 'Best cheap film stock for street photography?', 'Looking for suggestions under $12 a roll.', null, '2026-11-04T10:00:00-05:00'::timestamptz),
  ('thr-2', 'com-photo', 'stu-jordan', null, 'Anyone up for a Saturday photo walk?', 'Thinking Old City, 10 AM. All skill levels.', null, '2026-11-03T12:00:00-05:00'::timestamptz),
  ('thr-3', 'com-music', 'stu-sam', null, 'Free plugins worth installing', 'Drop your favorites and what you use them for.', null, '2026-11-02T18:00:00-05:00'::timestamptz),
  ('thr-4', 'com-study', 'stu-taylor', null, 'Data structures study group, Tuesdays?', 'Looking for 3-4 people. Library or online.', null, '2026-11-02T09:00:00-05:00'::timestamptz),
  ('thr-5', 'com-film', 'stu-alex', null, 'Crew call: weekend shoot', 'Need a boom operator and a gaffer for a two-day shoot.', null, '2026-11-01T17:00:00-05:00'::timestamptz),
  ('thr-6', 'com-fashion', 'stu-casey', null, 'Best spots for thrifting in Philly?', 'Looking for places that are budget friendly and not too picked over.', null, '2026-11-04T13:00:00-05:00'::timestamptz),
  ('thr-7', 'com-startup', 'stu-priya', null, 'Share your 3-minute pitch structure', 'What order do you cover problem, solution, ask?', null, '2026-11-03T15:00:00-05:00'::timestamptz),
  ('thr-8', 'com-life', 'stu-marcus', null, 'Cheap eats near campus', 'Student-submitted tips only. Prices change, so double check.', null, '2026-11-02T12:00:00-05:00'::timestamptz),
  ('thr-9', 'com-gaming', 'stu-devon', null, 'Game jam team forming', 'Need one artist and one sound person for the next jam.', null, '2026-11-01T20:00:00-05:00'::timestamptz);

-- thread_replies (9)
insert into thread_replies (id, thread_id, author_id, body, created_at) values
  ('rep-1', 'thr-1', 'stu-jordan', 'I had good luck with 400-speed black and white. Cheap and forgiving.', '2026-11-04T11:00:00-05:00'::timestamptz),
  ('rep-2', 'thr-1', 'stu-alex', 'Seconding that. Also check local shops for expired stock.', '2026-11-04T12:30:00-05:00'::timestamptz),
  ('rep-3', 'thr-2', 'stu-riley', 'In! I know a good spot for golden hour.', '2026-11-03T13:00:00-05:00'::timestamptz),
  ('rep-4', 'thr-3', 'stu-taylor', 'Not a producer but I use a free EQ for my podcast edits.', '2026-11-02T19:00:00-05:00'::timestamptz),
  ('rep-5', 'thr-4', 'stu-morgan', 'Wish I could join, but good luck!', '2026-11-02T10:00:00-05:00'::timestamptz),
  ('rep-6', 'thr-6', 'stu-riley', 'South Street has a few good ones. Go on a weekday.', '2026-11-04T14:00:00-05:00'::timestamptz),
  ('rep-7', 'thr-7', 'stu-morgan', 'Problem, quick demo, ask. Keep the ask specific.', '2026-11-03T16:00:00-05:00'::timestamptz),
  ('rep-8', 'thr-8', 'stu-jordan', 'Anything near the student center after 8 is a safe bet.', '2026-11-02T13:00:00-05:00'::timestamptz),
  ('rep-9', 'thr-9', 'stu-sam', 'I can do sound if the jam is on a weekend.', '2026-11-02T09:00:00-05:00'::timestamptz);

-- projects (13)
insert into projects (id, owner_id, kind, title, description, category, skills_needed, status, is_published, deadline, pitch, cover_url, roles, perks, commitment, created_at, updated_at) values
  ('proj-1', 'stu-jordan', 'collaborators', 'Short Documentary', 'A short documentary about student life, told by the students living it. We follow ten people through one ordinary day each, from first alarm to last light in the library, and cut them into a single honest portrait. Right now it is early planning, so what you join is shaped by who joins.', 'Media & Production', '{}'::text[], 'private', false, null, 'Ten students, ten ordinary days. One honest portrait of what student life really feels like.', 'https://images.unsplash.com/photo-1625690303837-654c9666d2d0?auto=format&fit=crop&w=1400&q=75', '[]'::jsonb, array['Director and producer credits for the whole crew', 'A finished short for your reel']::text[], 'Flexible · early planning', '2026-11-01T12:00:00.000Z'::timestamptz, '2026-11-01T12:00:00.000Z'::timestamptz),
  ('proj-2', 'stu-sam', 'collaborators', 'Student Podcast Pilot', 'A weekly show about campus creators: the person running a radio show at 2 a.m., the student sewing their own line, the team building an app between classes. Each episode is a 30-minute conversation recorded in a campus studio. We have the format, the first guests and the recording time booked. We need a second voice and someone who loves making audio sound good.', 'Music', array['hosting', 'audio editing']::text[], 'recruiting', true, '2026-12-15'::date, 'Every week, one student making something you never knew existed on campus. We need a second voice and an ear for sound.', 'https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?auto=format&fit=crop&w=1400&q=75', '[{"title":"Co-host","description":"Sit across from the guest, keep the conversation moving and ask the questions the audience is thinking. No broadcast experience needed."},{"title":"Audio editor","description":"Cut, clean and publish a 30-minute episode each week. We’ll share a template so you are not starting from zero."}]'::jsonb, array['Your name on every episode', 'A published series to show in internship applications', 'Meet a new campus creator every week']::text[], '3–4 hrs/week for 8 episodes', '2026-11-01T12:00:00.000Z'::timestamptz, '2026-11-01T12:00:00.000Z'::timestamptz),
  ('proj-3', 'stu-taylor', 'need-help', 'Portfolio site feedback', 'I’m applying for summer internships and my portfolio site is the first thing recruiters will see. The work is there, but I can’t tell if the site shows it well. I’m looking for fresh eyes: people who will click around, tell me where they got confused and be honest about what feels off. It takes about half an hour and I’ll happily review yours back.', 'Design & Creative', array['UX review', 'visual design']::text[], 'recruiting', true, '2026-11-30'::date, 'Internship applications are open and my portfolio site isn’t ready. I need a few honest eyes on it.', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1400&q=75', '[{"title":"UX reviewer","description":"Click through the site as a recruiter would and tell me where you got lost."},{"title":"Visual design eye","description":"Flag type, spacing and color choices that feel off, and suggest what to try."}]'::jsonb, array['A thank-you credit on the site', 'Return feedback on your own work, happy to swap']::text[], 'One 30-minute review', '2026-11-01T12:00:00.000Z'::timestamptz, '2026-11-01T12:00:00.000Z'::timestamptz),
  ('proj-4', 'stu-alex', 'collaborators', 'Short Film: Night Shift', 'Night Shift is a ten-minute thriller set on the last bus of the night, shot over two weekends. Picture and story are in good shape. What it needs is a sound designer to make the dark feel alive: engine hum, distant sirens, the thing you hear behind you. You’d work directly with the director on every scene.', 'Media & Production', array['sound design']::text[], 'recruiting', true, '2026-12-10'::date, 'A ten-minute thriller set on the last bus of the night. It looks great. Now it needs to sound terrifying.', 'https://images.unsplash.com/photo-1586165877141-3dbcfc059283?auto=format&fit=crop&w=1400&q=75', '[{"title":"Sound designer","description":"Build the ambience, foley and final mix from scratch. You own how every scene feels."}]'::jsonb, array['Sound design credit on festival submissions', 'Work alongside the film’s director and producer', 'A mix you can put straight into your reel']::text[], '2 shoot weekends, then ~5 hrs/week in post', '2026-11-01T12:00:00.000Z'::timestamptz, '2026-11-01T12:00:00.000Z'::timestamptz),
  ('proj-5', 'stu-casey', 'collaborators', 'Campus Style Zine', 'Campus Style Zine is a printed magazine about how students really dress, from thrift flips to full looks. Issue 1 got passed around the whole floor. For issue 2 we’re planning four editorials and a bigger layout, and we need people who see things visually to help us pull it off.', 'Design & Creative', array['photography', 'layout']::text[], 'recruiting', true, '2026-12-05'::date, 'Issue 2 of a printed zine about how students actually dress. We have the styling, we need the pictures and the page.', 'https://images.unsplash.com/photo-1525247663235-1d5a3ae627fd?auto=format&fit=crop&w=1400&q=75', '[{"title":"Photographer","description":"Shoot four short editorials around campus and Center City, with styled looks already planned."},{"title":"Layout designer","description":"Turn photos and words into a 24-page printed zine. Experience in any layout tool is enough."}]'::jsonb, array['Byline on every page you touch', 'Printed copies to keep', 'A real publication for your portfolio']::text[], 'About 4 hrs/week for 5 weeks', '2026-11-01T12:00:00.000Z'::timestamptz, '2026-11-01T12:00:00.000Z'::timestamptz),
  ('proj-6', 'stu-devon', 'need-help', 'Study group scheduler app', 'Four people, four timetables, forty messages to find one free hour. This small web app matches study group times automatically. The matching logic already works. What it lacks is a clean interface that makes people want to use it, and a second pair of hands on the front end.', 'Technology', array['UI design', 'React']::text[], 'recruiting', true, '2026-12-12'::date, 'Finding a time when four people are free shouldn’t take forty messages. The logic works, it just needs to look and feel good.', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=75', '[{"title":"UI designer","description":"Design the three core screens so a group can agree on a time in under a minute."},{"title":"React developer","description":"Help turn the designs into components and review pull requests together."}]'::jsonb, array['Co-credit on a shipped app', 'Real feedback from students who’ll use it', 'Open-source commit history']::text[], '2–3 hrs/week for a month', '2026-11-01T12:00:00.000Z'::timestamptz, '2026-11-01T12:00:00.000Z'::timestamptz),
  ('proj-7', 'stu-priya', 'need-help', 'Pitch deck review', 'I’m pitching a snack startup at pitch night in two weeks and I have a ten-slide deck I’ve stared at for too long. I need people who haven’t seen it to tell me honestly where the story lags and which numbers don’t convince. Twenty minutes of your time could change how the room reacts.', 'Business & Entrepreneurship', array['storytelling', 'finance']::text[], 'recruiting', true, '2026-11-17'::date, 'Pitch night is in two weeks. I need people who will tell me which slide loses the room.', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1400&q=75', '[{"title":"Storytelling coach","description":"Tell me where the story drags and what the first 30 seconds should say."},{"title":"Finance sanity check","description":"Look at the numbers slide and poke holes in the assumptions."}]'::jsonb, array['Front-row seat to the pitch', 'A mention in the finished deck']::text[], 'One 20-minute review', '2026-11-01T12:00:00.000Z'::timestamptz, '2026-11-01T12:00:00.000Z'::timestamptz),
  ('proj-8', 'stu-alex', 'need-help', 'Beta testers for our film-festival site', 'We are launching a ticketing page for the student film festival and need real people to try it on their phones before it goes live.', 'Technology', array['QA testing', 'UX feedback']::text[], 'recruiting', true, '2026-11-20'::date, 'Try to buy a festival ticket on your phone and tell us the exact moment you got confused.', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=75', '[{"title":"Phone tester","description":"Walk through browsing films and “buying” a ticket on your own phone. Screen-record if you can, and say what you expected to happen."},{"title":"Accessibility check","description":"Try the page with a screen reader or keyboard only and note anything you cannot reach or understand."}]'::jsonb, array['Free festival pass for every tester', 'Named in the site credits', 'Your feedback ships before opening night']::text[], 'One 30-minute session', '2026-11-01T12:00:00.000Z'::timestamptz, '2026-11-01T12:00:00.000Z'::timestamptz),
  ('proj-9', 'stu-riley', 'offer-help', 'Photo editing coaching, no experience needed', 'Free short coaching sessions on editing phone and camera photos so they look like you meant it.', 'Design & Creative', array['photography', 'Lightroom']::text[], 'recruiting', true, null, 'Bring one photo you like and one you are not sure about. We will make both better together.', 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1400&q=75', '[{"title":"Editing basics","description":"Exposure, color and crop in Lightroom or a free phone app, using your own photos."},{"title":"Portfolio shot list","description":"Plan eight frames for a portfolio or zine page, then review them together."}]'::jsonb, array['Free, no strings, students helping students', 'Leave with a preset you can reuse', 'Optional feature in the next campus zine']::text[], '45-minute sessions, Thursdays', '2026-11-01T12:00:00.000Z'::timestamptz, '2026-11-01T12:00:00.000Z'::timestamptz),
  ('proj-10', 'stu-devon', 'offer-help', 'Debugging hours for homework and side projects', 'Stuck on a bug for more than an hour? Bring it. Open pairing sessions for React, TypeScript, Python and Git.', 'Technology', array['React', 'TypeScript', 'Git']::text[], 'recruiting', true, null, 'Two heads, one terminal. Most bugs are a five-minute fix once someone else is looking.', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=75', '[{"title":"React and TypeScript help","description":"Component state, hooks, types that will not compile. Bring the error message."},{"title":"Git rescue","description":"Merge conflicts, lost commits, “I pushed to the wrong branch”. We will sort it out calmly."}]'::jsonb, array['Pairing, not lectures: you keep the keyboard', 'Learn how to debug, not only this one bug']::text[], 'Drop in, 30–60 minutes', '2026-11-01T12:00:00.000Z'::timestamptz, '2026-11-01T12:00:00.000Z'::timestamptz),
  ('proj-11', 'stu-sam', 'need-help', 'Voices for the campus radio station promos', 'We are recording a set of short station promos and want a mix of student voices instead of just ours.', 'Music', array['voice acting', 'sound check']::text[], 'recruiting', true, '2026-11-25'::date, 'Ten seconds each, say a line, hear yourself on air all semester.', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1400&q=75', '[{"title":"Voice for promos","description":"Read three short lines in your own voice. No acting experience needed, just be yourself."},{"title":"Sound check helper","description":"Sit in the booth, listen for pops and room noise, and give a thumbs up or down."}]'::jsonb, array['Your voice on rotation', 'A tour of the booth', 'First pick of guest DJ slots']::text[], 'One 20-minute recording slot', '2026-11-01T12:00:00.000Z'::timestamptz, '2026-11-01T12:00:00.000Z'::timestamptz),
  ('proj-12', 'stu-jordan', 'collaborators', 'Freshman Field Guide', 'A one-page, illustrated guide to surviving the first semester, written by first-years for first-years.', 'Design & Creative', array['illustration', 'writing']::text[], 'active', true, '2026-12-08'::date, 'Everything I wish someone had told me in week one, in one page you will actually keep.', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=75', '[{"title":"Illustrator","description":"Draw six small spot illustrations for the sections. Any style that feels friendly works."},{"title":"Writer","description":"Turn rough notes into short, funny, honest tips of about 40 words each."}]'::jsonb, array['Byline and credit on the guide', 'Printed copies for orientation tables']::text[], 'About 2 hrs/week for 4 weeks', '2026-11-01T12:00:00.000Z'::timestamptz, '2026-11-01T12:00:00.000Z'::timestamptz),
  ('proj-13', 'stu-morgan', 'collaborators', 'Welcome Week Recap Video', 'A two-minute recap video of Welcome Week, shot by four students over one weekend.', 'Media & Production', array['video editing']::text[], 'completed', true, null, 'Finished and shown at the fall mixer. Two minutes, four editors, one very long weekend.', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=75', '[]'::jsonb, array['Credited on the published video', 'A finished piece for your reel']::text[], 'Completed', '2026-11-01T12:00:00.000Z'::timestamptz, '2026-11-01T12:00:00.000Z'::timestamptz);

-- project_memberships (20)
insert into project_memberships (id, project_id, student_id, role, status, contribution_summary) values
  ('pm-1', 'proj-1', 'stu-jordan', 'Owner', 'active', null),
  ('pm-2', 'proj-2', 'stu-sam', 'Owner', 'active', null),
  ('pm-3', 'proj-2', 'stu-riley', 'Producer', 'active', 'Cover art and promo photos'),
  ('pm-4', 'proj-3', 'stu-taylor', 'Owner', 'active', null),
  ('pm-5', 'proj-4', 'stu-alex', 'Owner', 'active', null),
  ('pm-6', 'proj-4', 'stu-morgan', 'Producer', 'active', 'Budget and scheduling'),
  ('pm-7', 'proj-5', 'stu-casey', 'Owner', 'active', null),
  ('pm-8', 'proj-5', 'stu-riley', 'Photographer', 'active', 'Cover shoot'),
  ('pm-9', 'proj-6', 'stu-devon', 'Owner', 'active', null),
  ('pm-10', 'proj-7', 'stu-priya', 'Owner', 'active', null),
  ('pm-s1', 'proj-8', 'stu-alex', 'Owner', 'active', null),
  ('pm-s2', 'proj-9', 'stu-riley', 'Owner', 'active', null),
  ('pm-s3', 'proj-10', 'stu-devon', 'Owner', 'active', null),
  ('pm-s4', 'proj-11', 'stu-sam', 'Owner', 'active', null),
  ('pm-s5', 'proj-12', 'stu-jordan', 'Owner', 'active', null),
  ('pm-s6', 'proj-12', 'stu-casey', 'Illustrator', 'active', null),
  ('pm-s7', 'proj-2', 'stu-jordan', 'Co-host', 'active', null),
  ('pm-s8', 'proj-13', 'stu-morgan', 'Owner', 'active', null),
  ('pm-s9', 'proj-13', 'stu-jordan', 'Editor', 'active', 'Cut the final two-minute recap and color-corrected the footage'),
  ('pm-s10', 'proj-13', 'stu-riley', 'Photographer', 'active', 'Shot the b-roll for the opening');

-- project_join_requests (1)
insert into project_join_requests (id, project_id, student_id, message, status, created_at) values
  ('pjr-1', 'proj-3', 'stu-morgan', 'I can give feedback from a business-branding angle.', 'pending', '2026-11-04T09:00:00-05:00'::timestamptz);

-- project_tasks (11)
insert into project_tasks (id, project_id, title, description, assignee_id, status, due_at) values
  ('task-1', 'proj-1', 'Draft a one-page outline', null, null, 'todo', null),
  ('task-2', 'proj-4', 'Lock shooting schedule', null, 'stu-morgan', 'in-progress', null),
  ('task-3', 'proj-4', 'Location scouting', null, 'stu-alex', 'done', null),
  ('task-4', 'proj-2', 'Record trailer episode', null, 'stu-sam', 'in-progress', null),
  ('task-5', 'proj-5', 'Pick cover photo', null, 'stu-riley', 'in-progress', null),
  ('task-6', 'proj-5', 'Outline issue 2 layout', null, 'stu-casey', 'todo', null),
  ('task-s1', 'proj-12', 'Write the “first week” section', null, 'stu-jordan', 'in-progress', null),
  ('task-s2', 'proj-12', 'Sketch six spot illustrations', null, 'stu-casey', 'todo', null),
  ('task-s3', 'proj-12', 'Collect tips from five first-years', null, 'stu-jordan', 'done', null),
  ('task-s4', 'proj-2', 'Prepare three interview questions', null, 'stu-jordan', 'todo', null),
  ('task-s5', 'proj-13', 'Export final cut', null, 'stu-jordan', 'done', null);

-- project_milestones (6)
insert into project_milestones (id, project_id, title, due_at, done) values
  ('ms-1', 'proj-4', 'Script locked', '2026-11-12'::date, true),
  ('ms-2', 'proj-4', 'Shoot weekend 1', '2026-11-21'::date, false),
  ('ms-3', 'proj-2', 'Record trailer episode', '2026-11-18'::date, false),
  ('ms-s1', 'proj-12', 'Draft copy done', '2026-11-18'::date, false),
  ('ms-s2', 'proj-12', 'Illustrations in', '2026-11-30'::date, false),
  ('ms-s3', 'proj-13', 'Premiere at the fall mixer', '2026-10-24'::date, true);

-- project_files (1)
insert into project_files (id, project_id, name, added_by_id, created_at) values
  ('pf-1', 'proj-4', 'night-shift-script-v3.pdf', 'stu-alex', '2026-11-03T10:00:00-05:00'::timestamptz);

-- collections (5)
insert into collections (id, owner_id, title, description, visibility) values
  ('col-1', 'stu-riley', 'Philly light studies', 'Frames I keep returning to.', 'public'),
  ('col-2', 'stu-alex', 'Lighting references', null, 'public'),
  ('col-3', 'stu-jordan', 'Ideas (private)', 'Personal inspiration board.', 'private'),
  ('col-4', 'stu-casey', 'Zine inspiration', 'Layouts and colors I love.', 'public'),
  ('col-5', 'stu-devon', 'Game jam toolkit', null, 'public');

-- collection_items (7)
insert into collection_items (collection_id, post_id, position) values
  ('col-1', 'post-1', 0),
  ('col-1', 'post-12', 1),
  ('col-2', 'post-7', 0),
  ('col-3', 'post-5', 0),
  ('col-4', 'post-15', 0),
  ('col-4', 'post-27', 1),
  ('col-5', 'post-22', 0);

-- portfolio_items (5)
insert into portfolio_items (id, owner_id, title, description, category, credits, skills, link_url, visibility) values
  ('port-1', 'stu-riley', 'Broad Street series', 'Documentary photography, film scans.', 'Photography', '{}'::text[], '{}'::text[], null, 'public'),
  ('port-2', 'stu-sam', 'Beat tape Vol. 1', 'Eight original instrumentals.', 'Music/Audio', '{}'::text[], '{}'::text[], null, 'public'),
  ('port-3', 'stu-taylor', 'Campus event finder', 'React + TypeScript side project.', 'Apps & Websites', '{}'::text[], '{}'::text[], null, 'temple-only'),
  ('port-4', 'stu-casey', 'Upcycled denim series', 'Six garments from thrifted materials.', 'Design', '{}'::text[], '{}'::text[], null, 'public'),
  ('port-5', 'stu-devon', '48-hour platformer', 'Game jam entry made with a team of four.', 'Apps & Websites', '{}'::text[], '{}'::text[], null, 'public');

-- conversations (7)
insert into conversations (id, type, organization_id, project_id, title) values
  ('conv-film-board', 'organization-board', 'org-film', null, 'Board Chat'),
  ('conv-film-members', 'organization-members', 'org-film', null, 'Member Chat'),
  ('conv-founders-board', 'organization-board', 'org-founders', null, 'Board Chat'),
  ('conv-founders-members', 'organization-members', 'org-founders', null, 'Member Chat'),
  ('conv-radio-board', 'organization-board', 'org-radio', null, 'Board Chat'),
  ('conv-radio-members', 'organization-members', 'org-radio', null, 'Member Chat'),
  ('conv-dm-1', 'direct', null, null, null);

-- conversation_participants (2)
insert into conversation_participants (conversation_id, student_id) values
  ('conv-dm-1', 'stu-alex'),
  ('conv-dm-1', 'stu-morgan');

-- messages (6)
insert into messages (id, conversation_id, sender_id, body, created_at) values
  ('msg-1', 'conv-film-board', 'stu-alex', 'Budget review before the next screening night. Morgan, can you bring the numbers?', '2026-11-03T20:00:00-05:00'::timestamptz),
  ('msg-2', 'conv-film-board', 'stu-morgan', 'Yep, will bring them Thursday.', '2026-11-03T20:12:00-05:00'::timestamptz),
  ('msg-3', 'conv-film-members', 'stu-alex', 'Welcome everyone! Screening night is coming up. Details in announcements.', '2026-11-02T10:00:00-05:00'::timestamptz),
  ('msg-4', 'conv-film-members', 'stu-taylor', 'Excited! Can I help with the projector setup?', '2026-11-02T10:30:00-05:00'::timestamptz),
  ('msg-5', 'conv-dm-1', 'stu-alex', 'Hey, are you in for the Night Shift shoot?', '2026-11-04T09:00:00-05:00'::timestamptz),
  ('msg-6', 'conv-founders-board', 'stu-morgan', 'Draft agenda for pitch night is in the doc.', '2026-11-03T09:30:00-05:00'::timestamptz);

-- resources (8)
insert into resources (id, title, description, category, official_url, contact, location_name, eligibility, cost, source_type, last_verified_at) values
  ('res-advising', 'Academic advising', 'Get help planning your courses and talking through academic questions. Reach your own advisor through official Temple channels.', 'academic', null, null, 'Charles Library', null, null, 'unverified', null),
  ('res-tutoring', 'Tutoring and study help', 'Find support for tough courses and study skills. Check official Temple pages for what is currently offered.', 'academic', null, null, 'Charles Library', null, null, 'unverified', null),
  ('res-career', 'Career exploration', 'Resume help, internships and networking support. Check official Temple career pages for current offerings.', 'career', null, null, 'Annenberg Hall', null, null, 'unverified', null),
  ('res-wellness', 'Wellness and counseling', 'Support for stress, mental health and overall wellbeing. If you or someone you know needs help right now, contact campus or emergency services.', 'wellness', null, null, null, null, null, 'unverified', null),
  ('res-finaid', 'Financial aid questions', 'Questions about aid, billing and paying for school. Confirm deadlines and eligibility with official sources.', 'financial', null, null, null, null, null, 'unverified', null),
  ('res-tech', 'Technology help', 'Help with computers, Wi-Fi and software.', 'campus-life', null, null, 'TECH Center', null, null, 'unverified', null),
  ('res-student-center', 'Student center spaces', 'Places to meet, eat and hang out between classes.', 'campus-life', null, null, 'Howard Gittis Student Center', null, null, 'unverified', null),
  ('res-peer-tips', 'Peer tips: finding quiet study spots', 'Student-submitted tip list. Not official information.', 'campus-life', null, null, null, null, null, 'student-submitted', null);

-- campus_places (38)
insert into campus_places (id, name, lat, lng, layers, note, featured) values
  ('pl-1', 'Howard Gittis Student Center', 39.979356, -75.154976, array['Campus Life', 'Organizations', 'Events', 'Dining']::text[], 'Student life hub on N 13th St.', true),
  ('pl-2', 'Charles Library', 39.982148, -75.155368, array['Study', 'Resources', 'Events', 'Organizations']::text[], 'Main campus library at 1900 N 13th St.', true),
  ('pl-3', 'TECH Center', 39.980117, -75.153139, array['Technology', 'Study', 'Events']::text[], 'Technology and collaboration space.', true),
  ('pl-4', 'Tuttleman Learning Center', 39.9803572, -75.1541994, array['Study', 'Events', 'Organizations']::text[], 'Learning center at 1809 N 13th St.', true),
  ('pl-5', 'Annenberg Hall', 39.9839997, -75.1549674, array['Events', 'Other']::text[], 'Academic building on N 13th St.', true),
  ('pl-6', 'Mitten Hall', 39.981921, -75.1566744, array['Campus Life', 'Events']::text[], 'Historic campus building on N Broad St.', true),
  ('pl-7', 'Liacouras Center', 39.9798139, -75.1585825, array['Events', 'Campus Life']::text[], 'Arena at 1776 N Broad St.', true),
  ('pl-8', 'Temple Performing Arts Center', 39.981442, -75.156813, array['Events', 'Campus Life']::text[], 'Performing arts venue on campus.', true),
  ('pl-9', 'Independence Blue Cross Student Recreation Center', 39.979199, -75.158996, array['Campus Life']::text[], 'Student recreation and fitness center.', true),
  ('pl-10', 'Temple University Station', 39.98081, -75.15067, array['Other']::text[], 'Regional rail station on W Berks St. Check SEPTA for real schedules.', true),
  ('pl-11', 'Cecil B. Moore Station', 39.978572, -75.158095, array['Other']::text[], 'Broad Street Line subway station. Check SEPTA for real schedules.', true),
  ('pl-12', 'Charles L. Blockson Afro-American Collection', 39.981367, -75.156195, array['Study', 'Resources']::text[], 'Research collection and library space.', false),
  ('pl-13', 'Engineering Building', 39.982397, -75.152766, array['Technology', 'Study']::text[], 'Academic building for engineering.', false),
  ('pl-14', 'Common Grounds', 39.979101, -75.162307, array['Technology', 'Study']::text[], 'Internet cafe near campus.', false),
  ('pl-15', 'Starbucks', 39.979488, -75.154858, array['Dining']::text[], 'Coffee shop near the student center.', false),
  ('pl-16', 'Saxbys', 39.981662, -75.156078, array['Dining']::text[], 'Coffee shop on N Broad St.', false),
  ('pl-17', 'Cloud Coffee', 39.982811, -75.153573, array['Dining']::text[], 'Coffee shop near Tyler School of Art.', false),
  ('pl-18', 'Lucky Cup Cafe', 39.984004, -75.155087, array['Dining']::text[], 'Cafe north of campus.', false),
  ('pl-19', 'Halal Carts', 39.979627, -75.155495, array['Dining']::text[], 'Food carts near the student center. Carts and offerings change, so check in person.', false),
  ('pl-20', 'Chipotle', 39.979546, -75.153711, array['Dining']::text[], 'Fast-casual restaurant on N 13th St.', false),
  ('pl-21', 'Cava', 39.979475, -75.153183, array['Dining']::text[], 'Fast-casual restaurant on N 12th St.', false),
  ('pl-22', 'Potbelly', 39.979577, -75.153569, array['Dining']::text[], 'Sandwich shop near campus.', false),
  ('pl-23', 'Five Guys', 39.978708, -75.153662, array['Dining']::text[], 'Burger restaurant near campus.', false),
  ('pl-24', 'Honeygrow', 39.978472, -75.157466, array['Dining']::text[], 'Restaurant on N Broad St.', false),
  ('pl-25', 'Blaze Pizza', 39.979531, -75.153392, array['Dining']::text[], 'Pizza restaurant near campus.', false),
  ('pl-26', 'Insomnia Cookies', 39.978463, -75.157375, array['Dining']::text[], 'Cookie shop on N Broad St.', false),
  ('pl-27', 'The Fresh Grocer', 39.976852, -75.15764, array['Dining', 'Resources']::text[], 'Supermarket south of campus for groceries.', false),
  ('pl-28', '7-Eleven (Broad St)', 39.982039, -75.156057, array['Dining']::text[], 'Convenience store on N Broad St.', false),
  ('pl-29', 'Temple University Bookstore', 39.979435, -75.155016, array['Resources', 'Campus Life']::text[], 'Campus bookstore near the student center.', false),
  ('pl-30', 'Temple University Police Station', 39.979718, -75.152924, array['Resources']::text[], 'Campus police station. In an emergency, call 911.', false),
  ('pl-31', 'Temple University Police Substation', 39.981673, -75.156339, array['Resources']::text[], 'Campus police substation on N Broad St.', false),
  ('pl-32', 'CVS Pharmacy', 39.978428, -75.153807, array['Resources']::text[], 'Pharmacy near campus.', false),
  ('pl-33', 'Post Office', 39.979523, -75.154756, array['Resources']::text[], 'Postal services near the student center.', false),
  ('pl-34', 'PNC Bank', 39.981835, -75.156035, array['Resources', 'Other']::text[], 'Bank branch on N Broad St.', false),
  ('pl-35', 'STAR Complex', 39.9811, -75.159689, array['Campus Life']::text[], 'Student training and recreation complex.', false),
  ('pl-36', 'AMC Broadstreet 7', 39.977496, -75.158479, array['Campus Life', 'Events']::text[], 'Movie theater near campus.', false),
  ('pl-37', 'Indego Bike Share: 13th & Montgomery', 39.98005, -75.15522, array['Other']::text[], 'Bike share dock near the student center.', false),
  ('pl-38', 'Indego Bike Share: Broad & Cecil B. Moore', 39.97887, -75.15777, array['Other']::text[], 'Bike share dock near the Broad Street Line.', false);

-- assistant_scripts (7)
insert into assistant_scripts (id, keywords, response, source_resource_ids, is_fallback) values
  ('as-academic', array['advis', 'class', 'course', 'tutor', 'study', 'grade', 'academic']::text[], 'For course planning or study help, start with the academic entries below. I can’t tell you who your advisor is or when anyone is available, so please confirm details through official Temple sources.', array['res-advising', 'res-tutoring']::text[], false),
  ('as-career', array['job', 'intern', 'resume', 'career', 'network']::text[], 'Career support entries are listed below. Real offerings, deadlines and contacts should be checked on official Temple career pages.', array['res-career']::text[], false),
  ('as-wellness', array['stress', 'anxious', 'anxiety', 'counsel', 'mental', 'wellness', 'sad', 'overwhelmed']::text[], 'I’m sorry you’re dealing with that. Wellness support is listed below. If you or someone else needs help right now, please contact campus or emergency services.', array['res-wellness']::text[], false),
  ('as-money', array['money', 'aid', 'tuition', 'bill', 'financial', 'afford']::text[], 'Financial questions are covered in the entry below. I can’t state deadlines, eligibility or amounts, so please check official Temple sources.', array['res-finaid']::text[], false),
  ('as-tech', array['wifi', 'wi-fi', 'computer', 'laptop', 'tech', 'software', 'password']::text[], 'Technology help is listed below, and the TECH Center is on the Map. I can’t confirm services or hours.', array['res-tech']::text[], false),
  ('as-social', array['friend', 'meet', 'lonely', 'hang', 'eat', 'food', 'club', 'organization']::text[], 'To meet people, try Community groups, Events, or browse organizations. Spaces to hang out and a student tip list are below (the tips are student-submitted, not official).', array['res-student-center', 'res-peer-tips']::text[], false),
  ('as-fallback', '{}'::text[], 'I don’t have a verified answer for that. Try the Resources directory, or rephrase using words like advising, career, wellness, financial aid or tech help. I won’t guess at policies, hours or contacts.', '{}'::text[], true);

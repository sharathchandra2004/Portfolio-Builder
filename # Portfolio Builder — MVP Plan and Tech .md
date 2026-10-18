# Portfolio Builder — MVP Plan and Tech Stack

## Summary

Build an account-free web app that turns a user’s profile information or pasted resume text into an editable, responsive portfolio. Users choose one of three categories and one of three designs, preview the result, then download a standalone website ZIP with setup and deployment instructions.

The workspace is currently empty. The PRD’s suggested stack and shared-renderer architecture are a good fit for the MVP.

## Tech Stack

- **App:** Next.js, React, TypeScript, Tailwind CSS, and shadcn/ui.
- **AI:** Server-side provider integration for structuring input and improving copy. Keep provider calls and API keys on the server.
- **Validation:** A shared typed profile schema, validated on the server and client.
- **Local saving:** IndexedDB for drafts, so users can resume on the same browser without creating an account.
- **Portfolio rendering:** One shared profile model and rendering system, with a design registry for the nine category/design combinations.
- **Export:** Generate a standalone website ZIP from the profile and selected design. Include source, assets, dependency manifest, README, and deployment instructions. The exported site should render without an AI key.
- **Hosting guidance:** Document manual deployment to Vercel and Netlify; built-in hosting and one-click deployment are out of scope.

## Implementation Plan

1. **Foundation and onboarding:** Define the shared profile model, build the landing page and guided form, support pasted resume text, and let users skip optional sections.
2. **Design system:** Implement the three categories and nine visually distinct design variants through reusable layouts and themes. Keep content intact when users switch designs.
3. **AI and generation:** Structure supplied content and improve its wording. Preserve meaning, mark missing details for review, and never invent qualifications, metrics, experience, or projects.
4. **Preview and editing:** Build a responsive editor with desktop/mobile preview, content editing, section toggles and ordering, design switching, accent color and font controls, and image replacement.
5. **Export and guidance:** Package the selected portfolio into a ZIP, include project-specific setup and deployment instructions, and validate the package before enabling download.
6. **Release readiness:** Verify all nine variants, incomplete profiles, mobile layouts, local saving and recovery, and exported projects from a clean extraction.

## Test Plan and Acceptance

- Cover onboarding from both form input and pasted text, including skipped sections and missing project data.
- Confirm AI output keeps to supplied facts and remains editable.
- Verify design changes preserve content and preview updates reflect edits without a full-page reload.
- Check keyboard navigation, semantic controls, readable contrast, responsive layouts, and reduced-motion behavior.
- Extract representative ZIPs into a clean directory; install dependencies and confirm production builds succeed.
- Confirm export instructions cover local setup plus Vercel and Netlify deployment, and that no secret is included in client-side code.

## Assumptions

- The first release has no accounts, cloud storage, hosted portfolio URLs, or direct deployment.
- Drafts are saved locally in the browser; clearing browser storage can remove them.
- External profile links are displayed as links only; automatic profile scraping is not promised.
- All nine designs share a profile schema and export pipeline, while their layouts and visual treatments remain distinct.

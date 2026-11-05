# skills.md – Premium UI & Micro-Interactions Guide
### Gadget Store Frontend

> This file is the **single source of truth** for how the AI agent should design and implement UI.
> The goal is to produce interfaces that feel **premium, modern, and alive** — never generic Bootstrap/Tailwind template-looking.

Focus on: excellent visual hierarchy, clean product storytelling, spacious layouts, and refined interactions.

---

## 1. Core Design Philosophy

- **Premium over Generic**: Avoid looking like a default Tailwind or shadcn template. Every screen should feel intentionally designed.
- **Visual Hierarchy First**: Users should instantly understand what is most important (product image → price → CTA → secondary info).
- **Breathing Room**: Generous whitespace is a feature, not a waste of space.
- **Delight through Motion**: Micro-interactions should feel smooth, purposeful, and slightly luxurious — never flashy or distracting.
- **Gadget Store Personality**: Clean, techy, trustworthy, slightly premium (think Apple-meets-modern-electronics-store).

---

## 2. Visual Style Foundation

### Color System (Recommended)
Use a refined, modern palette:

- **Background**: Soft off-white / `#F8F9FC` or pure white with subtle gray sections
- **Surface / Cards**: White with very soft shadow
- **Primary (CTA)**: Deep modern blue or electric indigo (e.g. `#3B82F6` → `#2563EB`)
- **Accent**: Soft coral / vibrant orange for highlights & discounts (optional)
- **Text**: 
  - Primary: `#0F172A` (slate-900)
  - Secondary: `#64748B` (slate-500)
- **Borders**: Very subtle (`border-slate-200/60`)
- **Success / Stock**: Emerald
- **Danger / Out of stock**: Rose

Avoid pure black and overly saturated colors.

### Typography
- Headings: Strong, modern font, Outfit
- Clear hierarchy: Large bold product titles, medium section titles, readable body
- Generous line-height for product descriptions

### Spacing & Radius
- Prefer larger spacing scale (p-6, p-8, gap-6, gap-8)
- Border radius: `rounded-2xl` or `rounded-3xl` for cards and buttons (modern & soft)
- Avoid tiny `rounded-md` everywhere

### Shadows
Use soft, layered shadows instead of harsh ones:
```css
shadow-[0_8px_30px_rgb(0,0,0,0.06)]
Or Tailwind: shadow-lg shadow-slate-200/50

3. Micro-Interactions & Motion Rules (Critical)
Always use Framer Motion for meaningful interactions.
Required Micro-Interactions

Element,Interaction,Feeling
Product Cards,Subtle scale + lift on hover + soft shadow increase,Premium & clickable
Add to Cart Button,Scale down on press + success check animation,Satisfying confirmation
Wishlist Heart,Fill + bounce/scale animation,Delightful
Image Gallery,Smooth fade or slide + thumbnail active state,Polished
Buttons,Hover lift + active scale(0.97),Tactile
Modals / Drawers,Fade + slight scale or slide from side,Smooth
Page Transitions,Subtle fade or shared layout animations,App-like
Loading States,Elegant skeleton loaders (not spinners only),Professional
Toast Notifications,Slide in + auto dismiss with progress,Non-intrusive
Quantity Selector,Smooth number change + button feedback,Refined
Filter / Sort,Instant feedback + layout animation,Responsive


Motion Principles

Duration: 200–400ms for most interactions
Easing: easeOut or custom cubic-bezier for premium feel
Never animate too many things at once
Respect prefers-reduced-motion

Example (Product Card):
jsx<motion.div
  whileHover={{ y: -6, scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
  className="..."
>

4. Component-Level Guidelines
Product Cards

Large, high-quality image with hover zoom or subtle scale
Soft rounded corners + elegant shadow
Clear product name, brand, price
Wishlist icon in top-right with animation
“Add to Cart” appears elegantly on hover (desktop) or always visible (mobile)
Stock status with soft badge

Product Detail Page (Highest Priority)
Inspired by the Shopcart reference:

Large immersive image gallery (main image + thumbnails)
Strong visual hierarchy: Image left / Info right on desktop
Sticky “Add to Cart” section on mobile
Clean price + discount display
Quantity selector with refined controls
Expandable sections for Description, Specs, FAQs, Reviews
Related products with smooth carousel
Trust signals (warranty, delivery, returns) with icons

Buttons

Primary: Solid, slightly larger, soft shadow, clear hover/active states
Secondary: Soft outline or ghost
Always include loading state (spinner or text change)
Minimum height 44–48px for good touch targets

Cards & Surfaces

Prefer white cards on soft gray background
Consistent padding and border-radius
Subtle hover states even on non-clickable cards when appropriate

Forms

Floating or clean labels
Soft focus rings
Clear error states with animation
Success states for completed actions


5. Anti-Patterns (Never Do These)

❌ Generic blue Bootstrap-looking buttons
❌ Tight spacing and cramped layouts
❌ Harsh black borders or heavy shadows
❌ Instant state changes without motion
❌ Default browser focus outlines only
❌ Overusing bright red/green without hierarchy
❌ Skeleton loaders that look broken
❌ Too many competing CTAs on one screen
❌ Ignoring empty states and loading states
❌ Making everything the same size/weight (poor hierarchy)


6. Page-Specific Expectations
Customer Side

Home / Product Listing: Beautiful grid, strong filters, smooth infinite scroll or pagination
Product Detail: Best page in the entire app — treat it as the hero experience
Cart: Clean summary, quantity controls with animation, coupon field with success feedback
Checkout: Progress indicator, trust badges, smooth form experience

Admin Side

Clean data-dense but not cluttered tables
Soft status badges with color meaning
Smooth modals for create/edit
Elegant empty states and loading skeletons
Analytics cards with subtle entrance animations


7. Recommended Libraries

Framer Motion → Required for micro-interactions
Lucide React → Clean, consistent icons
clsx / tailwind-merge → Clean class handling
React Hot Toast / Sonner → Beautiful notifications
Swiper or Embla Carousel → Smooth product galleries & related items
React Hook Form + Zod → Polished forms


8. AI Agent Instructions
When generating UI code, you must:

Prioritize visual hierarchy and spacious layouts
Add meaningful micro-interactions using Framer Motion
Use soft shadows, large border-radius, and refined colors
Make the Product Detail Page especially polished
Always include hover, active, loading, and empty states
Write clean, readable Tailwind classes
Prefer composition and reusable motion variants
Ask yourself: “Does this look like a premium Dribbble shot or a generic template?”

If the result looks generic → improve spacing, shadows, typography contrast, and motion.

Goal: Make every screen feel intentionally designed and delightful to use.
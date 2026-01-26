from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1280, 'height': 2000}) # Tall viewport
    page = context.new_page()

    print("Navigating to home...")
    page.goto("http://localhost:5173/")

    # Wait for React to mount
    page.wait_for_timeout(2000)

    # 1. Verify Pascal Lab
    # Locate the Pascal Lab card. It has title "חוק פסקל ומפל הלחצים"
    print("Verifying Pascal Lab...")
    pascal_title = page.get_by_text("חוק פסקל ומפל הלחצים")
    expect(pascal_title).to_be_visible()

    # Take screenshot of Pascal Lab area
    # We can screenshot the whole page or element. Let's do whole page first.
    page.screenshot(path="verification/dashboard_initial.png")

    # 2. Verify Fracture Mechanics
    print("Verifying Fracture Mechanics...")
    # Scroll to Fracture Mechanics
    # Title: "מכניקה של עומסים ושברים"
    fracture_title = page.get_by_text("מכניקה של עומסים ושברים")
    fracture_title.scroll_into_view_if_needed()

    # Click "Shear" (גזירה)
    shear_btn = page.get_by_role("button", name="גזירה")
    shear_btn.click()
    page.wait_for_timeout(500) # Wait for animation/render

    page.screenshot(path="verification/fracture_shear.png")

    # 3. Verify Fluid Journey
    print("Verifying Fluid Journey...")
    # Title: "מסע הנוזלים: מים לגוף"
    fluid_title = page.get_by_text("מסע הנוזלים: מים לגוף")
    fluid_title.scroll_into_view_if_needed()

    # Click "Next" (הבא) until Step 3
    # Step 0 -> Start
    # Step 1 -> Click Next
    # Step 2 -> Click Next
    # Step 3 -> Click Next
    # Wait, Step 0 is "Start". Logic: step < 5 ? setStep(step + 1).
    # Initial state is 0.
    # Text is "הבא".
    next_btn = page.get_by_role("button", name="הבא")

    # Go to Step 1
    next_btn.click()
    page.wait_for_timeout(500)

    # Go to Step 2
    next_btn.click()
    page.wait_for_timeout(500)

    # Go to Step 3
    next_btn.click()
    page.wait_for_timeout(1000) # Wait for animation/zoom

    page.screenshot(path="verification/fluid_journey_step3.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

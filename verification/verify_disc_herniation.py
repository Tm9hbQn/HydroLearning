from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1280, 'height': 2000})
    page = context.new_page()

    print("Navigating to home...")
    # Default vite port is 5173
    page.goto("http://localhost:5173/")

    # Wait for React to mount
    page.wait_for_timeout(2000)

    print("Verifying Disc Herniation Tool...")
    # Title: "פתופיזיולוגיה של הדיסק הבין-חולייתי"
    title = page.get_by_text("פתופיזיולוגיה של הדיסק הבין-חולייתי")
    title.scroll_into_view_if_needed()
    expect(title).to_be_visible()

    # Wait a bit for animations or rendering
    page.wait_for_timeout(1000)

    page.screenshot(path="verification/disc_herniation_visual.png")
    print("Screenshot saved to verification/disc_herniation_visual.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

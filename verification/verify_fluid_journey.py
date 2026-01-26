from playwright.sync_api import sync_playwright, expect

def verify_fluid_journey(page):
    print("Navigating to dashboard...")
    page.goto("http://localhost:5173/")

    print("Waiting for Fluid Journey title...")
    # Using the exact Hebrew title
    title_locator = page.get_by_text("מסע הנוזלים: מים לגוף")
    title_locator.scroll_into_view_if_needed()
    expect(title_locator).to_be_visible()

    print("Found title. Looking for Next button...")
    # Find the button with text "הבא" (Next)
    next_button = page.get_by_role("button", name="הבא")

    # Wait for it to be visible
    expect(next_button).to_be_visible()

    print("Clicking Next button...")
    next_button.click()

    # Verify step changed.
    # Step counter changes from "שלב 0 מתוך 5" to "שלב 1 מתוך 5".
    print("Verifying step change...")
    expect(page.get_by_text("שלב 1 מתוך 5")).to_be_visible()

    print("Taking screenshot...")
    page.screenshot(path="verification/verification.png")
    print("Screenshot saved.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_fluid_journey(page)
        except Exception as e:
            print(f"Error: {e}")
            try:
                page.screenshot(path="verification/error.png")
            except:
                pass
            raise
        finally:
            browser.close()

from playwright.sync_api import sync_playwright, expect

def verify_pascal_lab():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the dashboard
        # Assuming port 5173
        page.goto("http://localhost:5173/#/")

        # Wait for the Pascal Lab card to be visible
        # It's the first card.
        # We can look for the title "חוק פסקל ומפל הלחצים"
        expect(page.get_by_text("חוק פסקל ומפל הלחצים")).to_be_visible(timeout=10000)

        # Also wait for the water surface label which is part of Pascal Lab visualization
        expect(page.get_by_text("פני המים")).to_be_visible()

        # Let's adjust the slider to see the human fully covered if possible, or just default.
        # Default waterLevel is 0.
        # The human is visible even at 0 water level (outline).

        # We want to verify the height of the human.
        # Since we can't measure pixels easily in verification without reference,
        # we will take a screenshot and inspect it manually as per instructions.

        # Set water level to 2.0 to see full effect
        # Find the slider. It has a role "slider"?
        # The slider implementation: <input type="range" ... />
        page.get_by_role("slider").first.fill("2")

        # Wait for animation/update
        page.wait_for_timeout(1000)

        # Take a screenshot of the Pascal Lab section
        # We can locate the specific card or just the whole page.
        # Locating the card containing the text.
        card = page.locator(".bg-white", has_text="חוק פסקל ומפל הלחצים").first

        card.screenshot(path="verification/pascal_lab_human_height.png")

        browser.close()

if __name__ == "__main__":
    verify_pascal_lab()

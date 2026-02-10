import os
import time
from playwright.sync_api import sync_playwright, expect

def verify_dashboard_design(page):
    # Navigate to the dashboard
    page.goto("http://localhost:5173/")

    # Wait for the main content to load
    page.wait_for_selector('h1')

    # Wait a bit for fonts and styles to settle
    time.sleep(2)

    # Take a screenshot of the entire page
    screenshot_path = "verification/dashboard_design.png"
    page.screenshot(path=screenshot_path, full_page=True)
    print(f"Screenshot saved to {screenshot_path}")

if __name__ == "__main__":
    if not os.path.exists("verification"):
        os.makedirs("verification")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_dashboard_design(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

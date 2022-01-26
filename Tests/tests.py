import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


URL = "http://localhost:3000/"


class NewVisitorTest(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome("driver/chromedriver")

    def test_site_working(self):
        self.driver.get(URL)
        self.assertIn("Dropki.pl", self.driver.title)
        
        navbar = self.driver.find_element(By.ID, "basic-navbar-nav")
        navbar.find_element(By.LINK_TEXT, "Books").click()
        
        el = self.driver.find_elements_by_link_text("No books in store")
        self.assertEqual(len(el), 0, "No books in store")
        
        self.driver.find_element_by_class_name("card").click()
        self.assertNotIn("We can't find the page you are looking for", self.driver.page_source)

        navbar = self.driver.find_element(By.ID, "basic-navbar-nav")
        navbar.find_element(By.LINK_TEXT, "Drops").click()

        el = self.driver.find_elements_by_link_text("No drops in store")
        self.assertEqual(len(el), 0, "No drops in store")

        self.driver.find_element_by_class_name("card").click()
        self.assertNotIn("No drops in store", self.driver.page_source)

    def tearDown(self):
        self.driver.close()

class LoggedUserTest(unittest.TestCase):
    def setUp(self):
        self.url = URL
        self.username = "test_user"
        self.user_password = "test"
        self.driver = webdriver.Chrome("driver/chromedriver")
        self.driver.implicitly_wait(5)
        self.driver.get(self.url)

    def test_login(self):
        self.driver.find_element_by_link_text("Login").click()

        username = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "username")))
        username.send_keys(self.username)

        user_password = self.driver.find_element(By.ID, "password")
        user_password.send_keys(self.user_password)
        user_password.send_keys(Keys.ENTER)
        
        WebDriverWait(self.driver, 10).until_not(EC.presence_of_element_located((By.ID, "username")))
        self.assertEqual(self.driver.current_url, f"{self.url}/home")

        self.driver.find_element_by_class_name("card").click()
        self.driver.find_element(By.NAME, "buyBook").click()
        self.driver.find_element(By.NAME, "buyBook").click()

        self.driver.find_element(By.ID, "shippingName").send_keys("Test Account")
        self.driver.find_element(By.ID, "shippingStreet1").send_keys("Street")
        self.driver.find_element(By.ID, "shippingStreet2").send_keys("Street2")
        self.driver.find_element(By.ID, "shippingCity").send_keys("City")
        self.driver.find_element(By.ID, "shippingState").send_keys("State")
        self.driver.find_element(By.ID, "shippingCountry").send_keys("Country")
        self.driver.find_element(By.ID, "shippingZipcode").send_keys("12-123")

        self.driver.find_element(By.CSS_SELECTOR, "#shippingInfo > div > button").click()
        self.driver.find_element(By.ID, "theSameAsShippingAddress").click()
        self.driver.find_element(By.CSS_SELECTOR, "#paymentInfo > div > button").click()
        self.driver.find_element(By.CSS_SELECTOR, "#reviewItems > div > button").click()

        WebDriverWait(self.driver, 10).until_not(
            EC.presence_of_element_located((By.PARTIAL_LINK_TEXT, "order has been placed")))

    def tearDown(self):
        self.driver.close()


if __name__ == "__main__":
    unittest.main()

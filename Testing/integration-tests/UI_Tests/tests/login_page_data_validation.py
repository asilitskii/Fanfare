from pages.login_page import *
from utils.locators import *
from utils.users_lists import *
from seleniumbase import BaseCase
from dotenv import load_dotenv
import os

load_dotenv()

BASE_URL = os.getenv('BASE_URL')

BaseCase.main(__name__, __file__)

class LoginPageDataValidation(BaseCase):
    def test_sign_in_with_invalid_user(self):
        self.open(f'{BASE_URL}login')
        
        page = LoginPage()
        page.login_with_in_valid_user(self, "invalid_user_correct_email_password", base_users)
        page.clear_email(self)

    def test_fill_invalid_users_spec_symbols_email(self):
        self.open(f'{BASE_URL}login')
        
        page = LoginPage()

        for user in invalid_users_spec_symbols_email:
            page.enter_email(self, user["email"])
            page.enter_password(self, user["password"])
            self.find_element(*page.locator.ERROR_LOGIN_MESSAGE)
            page.click_login_button(self)
            page.clear_email(self)

    def test_fill_invalid_users_dot_in_email(self):
        self.open(f'{BASE_URL}login')
        
        page = LoginPage()    
        
        for user in invalid_users_dot_in_email:
            page.enter_email(self, user["email"])
            page.enter_password(self, user["password"])
            self.find_element(*page.locator.ERROR_LOGIN_MESSAGE)
            page.click_login_button(self)
            page.clear_email(self)

    def test_fill_invalid_users_spaces_email(self):
        self.open(f'{BASE_URL}login')
        
        page = LoginPage()      
        
        for user in invalid_users_spaces_email:
            page.enter_email(self, user["email"])
            page.enter_password(self, user["password"])
            self.find_element(*page.locator.ERROR_LOGIN_MESSAGE)
            page.click_login_button(self)
            page.clear_email(self)

    def test_fill_invalid_users_password(self):
        self.open(f'{BASE_URL}login')
        
        page = LoginPage()  
        
        for user in invalid_users_password:
            page.enter_email(self, user["email"])
            page.enter_password(self, user["password"])
            self.find_element(*page.locator.ERROR_LOGIN_MESSAGE)
            page.click_login_button(self)
            page.clear_email(self)

    def test_fill_invalid_users_non_english_letters(self):
        self.open(f'{BASE_URL}login')
        
        page = LoginPage()

        for user in invalid_users_non_english_letters:
            page.enter_email(self, user["email"])
            page.enter_password(self, user["password"])
            self.find_element(*page.locator.ERROR_LOGIN_MESSAGE)
            page.click_login_button(self)
            page.clear_email(self)

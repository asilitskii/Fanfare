from pages.login_page import *
from pages.register_page import *
from utils.locators import *
from utils.users_lists import *
from seleniumbase import BaseCase
from omkar_temp_mail import TempMail
from dotenv import load_dotenv
import os

load_dotenv()

BASE_URL = os.getenv('BASE_URL')
INVALID_VERIFICATION_CODE = os.getenv('INVALID_VERIFICATION_CODE')

BaseCase.main(__name__, __file__)

class RegisterPageVerificationFail(BaseCase):
    def test_verify_user_account_fail(self):
        self.open(f'{BASE_URL}email-verification/{INVALID_VERIFICATION_CODE}')

        self.find_element(*VerificationPageLocators.RETURN_TO_HOME_PAGE_BUTTON).click()
        self.find_element(*LoginPageLocators.LOGIN_PAGE)

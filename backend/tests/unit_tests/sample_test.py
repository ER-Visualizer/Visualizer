import pytest
import unittest
from flask import Flask

app = Flask(__name__)

import logging

def test_ok():
    app.logger.info("ok")


def test_work():
    assert 0 == 0
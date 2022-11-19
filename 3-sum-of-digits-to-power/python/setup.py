# -*- coding: utf-8 -*-

# Learn more: https://github.com/kennethreitz/setup.py

from setuptools import setup, find_packages


with open('README.rst') as f:
    readme = f.read()

setup(
    name='digitsum',
    version='1.0.0',
    description='finds numbers where sum of digits to power equal the number',
    long_description=readme,
    author='Mark Harris',
    author_email='ma_harris1011@hotmail.com',
    url='https://github.com/maharris1011/challenge/3-sum-of-digits-to-power/python',
    license=license,
    packages=find_packages(exclude=('tests', 'docs'))
)

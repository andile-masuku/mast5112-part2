# Basic Information

### Fengarófotis Psichés (Moonlit Souls)
### ANDILE TSHUMA NTOMBIZILE MASUKU (ST10477470)
### HIGHER CERTIFICATE IN MOBILE APPLICATION AND WEB DEVELOPMENT (MAST5112)

### LINKS

YouTube = <div class="cm-line" dir="auto">https://youtu.be/MrixBYddu5k</div>
Gitub = https://github.com/andile-masuku/mast5112-part2.git

# Project Overview

This app is all about helping the chef let the client know what dishes he will be preparing. the app is basically all about the chef being able to add items/dishes via the Menu management screen which will show the item he has added in the Home screen so that the client can know what the chef can prepare.This app was created using Both react and react native using Typescript code via Expo coded in Visual studio code.

# Purpose & Features

## Purpose:
This app it to make the chef's menu list simple and know what he can prepare when he wants to prepare it. It also helps with the clients to choose what he has prepared and not something he has to start working on. It also help's let the clients the price they can expect for the course and what courses he offers. It also helps the chef manage menus across the whole app.

## Key Features:

* Translator - to translate the text from Greek to English and vise versa
* Action Buttons - to add more items, delete an unwanted item or to clear the whole list of items in the menu management.
* The Scrollview - to just display the courses available and the avarage price for each course.
* the search bar is for the chef to be able to find the item easily just incase he wants to delete or edit the item
* The home Screen - to display the items that are available for the clients that have been added by the chef
* The model - is for the chef to be able to add more items to the list
* Total - to display the total number of items that are available to choose from.

# Design Overview (From Part 1)

## Login Screen

<img width="509" height="506" alt="Screenshot 2025-09-09 190055" src="https://github.com/user-attachments/assets/a0e10c86-5d8d-401b-b52e-61eabc2dbf4f" />

This screen will be the first screen for the app this will allow the user to 
Enter specific screens depending on who they are, example. If the chef clicks on the ‘MAGEIRAS’ button this will give him access to all screens and if the customer clicks on the ‘PELATIS(SA)’ button this will only allow them to access two screens. This screen only consists of the:
App Logo – The logo represents shining souls as the Butterflies are the souls, and the moonlight is the light that’s shining on the souls (for a peaceful setting).
User buttons – These are to navigate the users to different screens depending on who they are (chef or customer) for them to access the screens that they need to access/ see.
App Name - Fengarófotis Psichés meaning Moonlit Souls.

As for the background it is just a solid colour that matches the logo and the setting of the whole app. This also helps the logo stand out, also for the user’s mood to feel calm and peaceful.


## Home Screen

<img width="676" height="525" alt="Screenshot 2025-09-09 190140" src="https://github.com/user-attachments/assets/21a04868-458f-424f-bd5d-5b4d80d21dc2" />

This is the home screen where both users can have access to. This screen is to play a role in serving the customer what the chef has prepared. This is where the prepared menu will appear with the courses and dishes available. This screen will also serve a purpose in showing the total number of items/dishes available, it will also show the average price per course and the available courses on top. Each course will display the available dishes with the picture and a short description of the meal. Then the bottom there will be a navigation bar where it will allow the user to move from one screen to another.
This screen will consist of a:
FlatList – To display the prepared menu and make it scrollable to see all the dishes
Scrollview – To display the courses and the Average prices
Navigation Bar – To move across screens
Logo and App Name

## Menu Management Screen

<img width="1022" height="525" alt="Screenshot 2025-09-09 190308" src="https://github.com/user-attachments/assets/d0779365-824f-4568-bf0b-f06cb6eed5cf" />

This screen Only Chef Christoffel has access to it so, it will be disabled for the customers. This is where the chef will be able to create and edit the menu list.
This will help him select what he wants to add on the prepared menu. This screen has been made for him to work through it without any difficulties. He can search for the item instead of him having to scroll to look for it. He can also add, edit and delete the item/s. This is where he will list the items into courses, add descriptions and prices for the meals. He is able to change this anytime he wants to.
This screen consists of a:
Search Bar – To search for the dish or item
Search Results – To display the searched item
Add Button – To add new items into the list
FlatList – To display all the items added
Picker – To pick a course for the item
Save button – To save the new items added
Save button – To save what was added or edited in the item
Float screen – To add new items
Delete button – To delete unwanted items
Clear button – To clear the whole list just in case he wants to start over
Navigation Bar – To move across Screens

## View Prepared Menu Screen

<img width="547" height="528" alt="Screenshot 2025-09-09 190403" src="https://github.com/user-attachments/assets/53d4f973-a21c-4b6d-870d-acd2266541a5" />

Both users can access this screen. This is where all the courses and items are listed.
This is also where the price for each item will be shown… This screen it to show the customer what courses the app has. Not all the courses on this screen will be displayed in the Home screen only the ones selected by the chef.
This screen only serves the purpose of viewing the menu list only and the menus are listed in different courses. If the user does not want to scroll all the way to look for a specific, they can just use the menu filter on top to save time.
This page consists of a:

FlatList – To display the whole menu list
Filter buttons – To easily navigate through different courses 
Menu List – The 12 courses that will appear in the View Menu Screen

# Navigation & Flow

The Login screen will allow both users to enter the Home screen, it will also allow the chef to enter the Menu Management screen. In the home screen, the chef can either go to the Menu Management or the View Menu screen whereas the customer can only go to the View Menu screen. In the Menu Management the chef can go to any screen including the Home screen. In the View Menu screen both users can go back to the Home screen but only the chef can go back to the Menu Management screen.

<img width="940" height="570" alt="image" src="https://github.com/user-attachments/assets/b93bab21-f101-4620-a755-14fdbd2b5f81" />

# Technologies & Dependencies 

## Imports from React Native For The App
*React – So that the app can function 
*UseState and UseEffect – For data handling and updates 
*View, Text, StyleSheet – These are for layouts and Styling
*Images – For the Logo and the Dishes
*TextInput – This is for forms to add items and for the search bars
*TouchableOpacity – For the buttons and the filter
*FlatList – To display the Menu Items
*Model – This is for the float screen when adding new items
*ScrollView – To display The Course Names and prices and the filter
*Navigation – To be able to move through screens and courses
*Icons – For the Navigation Bar

## Imports To Use
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Modal, ScrollView,} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';

# Screenshots & Video Demonstration

## Youtube
https://youtu.be/MrixBYddu5k

# Development Process & ChangeLog

20 October, 21 October & 22 October
Translator has been added 
removed dependencies & changed styling
no Deleted features yet

# Challenges,Learnings & Reflections

The challenges I was implementing the translator in the app and the Model
It was hard to understand where the i had to put the translator code and how do i make it work
What i would do differently next time is to use react native tools more as a guideline and more of sir's codes of different apps to help with understanding.
i overcame them by watching youtube videos and also asking AI for Steps on how to implement them.

# References 

Anon., 2025. I Cook Stuff. [Online] 
Available at: https://www.icookstuff.com/en/kataifi-kadaif-kadayif-galaktoboureko-semolina-cream-milk-pie-shredded-filo-crust-syrup-epiphany-dessert-recipe/
[Accessed 08 September 2025].
Maione, C., n.d. Cookist. [Online] 
Available at: https://www.cookist.com/crispy-feta-saganaki-with-honey-and-sesame/
[Accessed 08 September 2025].
Perkins, M., Adams, C. & Obrecht, C., 2012. Canva. [Online] 
Available at: https://share.google/9rJFxFklfULRubzuL
[Accessed 8 September 2025].
Ruxandra, 2024. gourmandelle. [Online] 
Available at: https://gourmandelle.com/roasted-eggplant-mousse-perfect-eggplant-dip/
[Accessed 8 September 2025].
Walke, J., Chedeau, C., He, L. & Bharambe, A., 2015. React Native. [Online] 
Available at: https://share.google/5R9399pxZ4JUq5b0B
[Accessed 08 September 2025].
Wallace, D. E., 2016. Figma. [Online] 
Available at: https://share.google/JXwsohgEeIzgsnXoJ
[Accessed 08 September 2025].
React Native (2024). React Native · A framework for building native apps using React. [online] reactnative.dev. Available at: https://reactnative.dev/.

Sharepoint.com. (2025). [online] Available at: https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7BC4AAF478-96AC-4469-8005-F7CDC4A15EBB%7D&file=MAST5112MM.docx&action=default&mobileredirect=true   [Accessed 09 Sep. 2025].
Balboni, K. (2024). Visual Sitemap Examples, Templates, and Tools to Create Your Own. [online] www.userinterviews.com.  Available at: https://www.userinterviews.com/blog/sitemap-templates-examples-generators.
Sookha,J.(2025). [Github]. available at: https://github.com/jesselsookha/MAST2025.git

# Disclosure of AI Usage

<img width="787" height="354" alt="Screenshot 2025-10-22 222453" src="https://github.com/user-attachments/assets/d886236b-ec84-454e-9e1b-d062715deb78" />

<img width="710" height="316" alt="Screenshot 2025-10-22 222509" src="https://github.com/user-attachments/assets/2679dd37-1f65-4836-a4c4-e46aa5a18973" />

<img width="703" height="203" alt="Screenshot 2025-10-22 222532" src="https://github.com/user-attachments/assets/39f0ece1-0d86-4572-9381-c15ffeed07f7" />

it wasn't really that helpful the i asked gemini ai to help me push to my school repository but it didn't work so i ended up making my own.

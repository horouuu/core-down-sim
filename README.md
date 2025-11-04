# ToA Core Down Sim
## Features
### Tick-accuracy
This sim is tick-accurate. This means it follows the core-down time thresholds.\
The following example uses Core 1 (21 ticks):\
5 VW 1 BGS: (18 ticks)\
<img width="310" height="201" alt="image" src="https://github.com/user-attachments/assets/c2149f87-dd25-4634-858a-fd99760e4a62" />

5 Fang 1 BGS (22 ticks):\
<img width="310" height="235" alt="image" src="https://github.com/user-attachments/assets/66c3dd05-8ecc-4b46-9caf-53d03e9f8f45" />\
The BGS overflows to Core 2 in the second image, as there are only 21 ticks on the first core, and the BGS is "fired" on the 22nd tick.

### Row substitution
You can **shift-click** a row to substitute it with another hit.\
Adding a new row with a substituted row will prioritize replacing substituted rows first.\
<img src="https://github.com/user-attachments/assets/4104c7ea-f82b-4d6c-8c83-cc31e70c0f09" width="310" height="270">

### Drag-and-drop reordering
You can drag-and-drop a row anywhere to re-order it.\
All ticks and damage will be re-calculated automatically.\
<img src="https://github.com/user-attachments/assets/13ed9272-a6f8-4344-98ae-34896cb3e43a" width="310" height="303">

### Mobile-friendly (sort of)
The UI of the sim was designed to handle devices below 520px in width,\
but certain interactive features are currently not fully supported.

Substitution does not work at all unless the user manages to find a way to hold shift while tapping.\
Reordering will require the user to hold down a row until its text is selected.\
<img src="https://github.com/user-attachments/assets/2bfa3657-6bd8-4e93-acea-e4520805ad72" width="310" height="564">


## Usage
### Simming
Using the sim is very simple:
1. Enter your desired settings
2. Click on any weapon (ones with a green background are the special attacks of that weapon)\
  2.1. Click on any row to remove it if needed\
  2.2. Change your stats if necessary
3. Use the `Clear!` button to start over
### Settings
<img width="310" height="313" alt="image" src="https://github.com/user-attachments/assets/5e641665-0c97-4c1e-bcf0-a23bbe756de1" />

`Strength level`\
This is your un-boosted Strength stat.

`Strength bonus`\
This refers to the strength stat seen in your equipment screen with all your gear on **except the mainhand**. \
If, for any reason, you are going to go through the entirety of ToA with a two-handed weapon, then this would mean you wear nothing in your hands.

`Raid level`\
The invocation level of the raid you're simming.

`Team size`\
How many players are expected to be **alive** in your party when P2 starts.

`Avernic`\
Tick this if you have an Avernic defender as opposed to a Dragon defender.\
This is required to accurately calculate the max-hit of two-handed weapons used on the core.

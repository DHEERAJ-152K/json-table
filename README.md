# Configurable JSON-Driven Table UI  

## Project Setup  
- Vite (latest) with React + Material UI  
- A single Table component to visualize user data  
- Separate user data in JSON format [hard-coded data of 20 dummy users with a random image generator to implement avatars]  

## Approach  

- Implemented a name filter with applied debouncing  
- A dropdown filter for user roles with support for multiple role selection  
- Selected roles are shown inside the container [comma separated]  
- Only the selected data is visible in the table content  
- An option to sort users based on their age [ascending as well as descending order]  
- JSON-driven & configurable table using Material Table  

## Additional Features  

- Implemented pagination, limiting to 5 users per page  
- Previous and Next buttons to navigate through pages  
- Option to select an entire row with a single click  
- Option to select all data [all users] with a single click  
- Unique avatar image for every user using a random image generator  

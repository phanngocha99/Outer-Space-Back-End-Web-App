# outer-space

🌸 [HTML-CSS-React] An API server for Astronomy Outer-Space Website

📌 https://github.com/HiImHa/outer-space-api/

## Related Link

📌 GitHub repository: 
- Frondend: https://github.com/HiImHa/outer-space
- BackEnd: https://github.com/HiImHa/outer-space-api 

📌 Vercel deployment:  
- Frondend: https://outer-space-psi.vercel.app/ 
- BackEnd: https://outer-space-api.vercel.app/

## Features
🌟This website first will navigate you to **Hompage**:
- Show information of OuterSpace **About** 
- Summary of **News**, **Discovery**, **Event** of Astronomy information
- Show information of OuterSpace **Contact** \

🌟News, Discovery, Event pages include these features:
- Show **general bulletin** and **details information** when clicked on the post of News, Discovery, Event about Astronomy using **API personal server**. The information on the page can be **up-to-date** when the server updates data.
- Show **Astronomy Picture Of the Day** and **allow the user to select the date to see pictures** of that date using NASA API.\

🌟Another function: 
- Allow user to **register** and **login** to the page.
- Allow users to **create new posts** (available locally)
- **Only users who create posts can edit posts**.
- Allow users **edit post** (available locally)
- Edit Page can **automatically display data of the page user want to edit** to reduce the time.

## Used Technique
🌷 FrontEnd
- HTML, CSS, 
- Javascript
- React (react-router-dom, react-quill, useState(),useEffect(), useContext(), useParams())
- date-fns packet \

🌷 BackEnd:
- expressJs (nodeJs)
- cors packet
- bcrypt packet
- jwt packet
- cookies packet
- multer packet
- formidable packet

🌷Data base :
- mongoose
- mongoDB Atlas

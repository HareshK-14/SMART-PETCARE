# Deployment Instructions (Production)

To deploy the Smart Pet Care application for your college expo (or real web environments), follow these steps:

## Backend Deployment (Heroku/Render)
1. Ensure your `pom.xml` is configured.
2. Create a PostgreSQL Database on Render or ElephantSQL.
3. Update production credentials securely using Environment Variables.
4. Deploy using the Maven Procfile:
   ```
   web: java -jar target/backend-0.0.1-SNAPSHOT.jar
   ```

## Frontend Deployment (Vercel/Netlify)
1. Push your `frontend/` codebase to GitHub.
2. Link the repository to Vercel.
3. Add the build settings:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add Environment Variables pointing to your hosted Backend API url:
   `VITE_API_BASE_URL=https://your-backend-render.com/api`
5. Click **Deploy**. Vercel will auto-process the Tailwind CSS styles and React routers.

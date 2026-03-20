Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue
git init
git config user.email "developer@example.com"
git config user.name "Backend Developer"

git add core\
git commit -m "Backend: Setup project core structure and database session management"

git add models.py
git commit -m "Backend: Design database models for Parking System"

git add utils\
git commit -m "Backend: Implement authentication, JWT, and hashing utilities"

git add routers\registration.py routers\login.py
git commit -m "Backend: Build secure user registration and login APIs"

git add routers\parking.py routers\place.py routers\floor.py routers\category.py
git commit -m "Backend: Implement core parking, place, and floor management APIs"

git add routers\tariff.py routers\vehicleAmounts.py
git commit -m "Backend: Add pricing logic with tariff and vehicle amount routers"

git add routers\Roles\ routers\subuser.py
git commit -m "Backend: Create role-based access control and subuser APIs"

git add routers\dashboard.py routers\clubs.py routers\countries.py routers\migration.py
git commit -m "Backend: Add dashboard analytics and supporting APIs"

git add main.py requirements.txt .gitignore .env.example README.md
git commit -m "Backend: Integrate routers into main FastAPI application and add documentation"

git add vehicles-parking-system-frontend\.gitignore vehicles-parking-system-frontend\package* vehicles-parking-system-frontend\vite.config.mjs vehicles-parking-system-frontend\index.html
git commit -m "Frontend: Initialize React application"

git add vehicles-parking-system-frontend\src\components\ vehicles-parking-system-frontend\src\layout\ vehicles-parking-system-frontend\src\assets\ vehicles-parking-system-frontend\src\scss\ vehicles-parking-system-frontend\public\
git commit -m "Frontend: Scaffold UI components, assets, and layout"

git add vehicles-parking-system-frontend\src\views\ vehicles-parking-system-frontend\src\App.js vehicles-parking-system-frontend\src\routes.js vehicles-parking-system-frontend\src\index.js vehicles-parking-system-frontend\src\_nav.js vehicles-parking-system-frontend\src\store.js vehicles-parking-system-frontend\src\apiConfig.js
git commit -m "Frontend: Build application pages, integration, and routing"

git add .
git commit -m "Final cleanup and project polish"

git remote add origin https://github.com/hrxharshit1/vehicles-parking-system.git
git branch -M main
git log --oneline

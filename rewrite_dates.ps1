Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue
git init
git config user.email "hrharshitm@gmail.com"
git config user.name "hrxharshit1"

$env:GIT_AUTHOR_DATE="2026-03-01T10:00:00"
$env:GIT_COMMITTER_DATE="2026-03-01T10:00:00"
git add core\
git commit -m "Backend: Setup project core structure and database session management"

$env:GIT_AUTHOR_DATE="2026-03-03T11:30:00"
$env:GIT_COMMITTER_DATE="2026-03-03T11:30:00"
git add models.py
git commit -m "Backend: Design database models for Parking System"

$env:GIT_AUTHOR_DATE="2026-03-05T14:15:00"
$env:GIT_COMMITTER_DATE="2026-03-05T14:15:00"
git add utils\
git commit -m "Backend: Implement authentication, JWT, and hashing utilities"

$env:GIT_AUTHOR_DATE="2026-03-07T09:45:00"
$env:GIT_COMMITTER_DATE="2026-03-07T09:45:00"
git add routers\registration.py routers\login.py
git commit -m "Backend: Build secure user registration and login APIs"

$env:GIT_AUTHOR_DATE="2026-03-10T16:20:00"
$env:GIT_COMMITTER_DATE="2026-03-10T16:20:00"
git add routers\parking.py routers\place.py routers\floor.py routers\category.py
git commit -m "Backend: Implement core parking, place, and floor management APIs"

$env:GIT_AUTHOR_DATE="2026-03-12T13:10:00"
$env:GIT_COMMITTER_DATE="2026-03-12T13:10:00"
git add routers\tariff.py routers\vehicleAmounts.py
git commit -m "Backend: Add pricing logic with tariff and vehicle amount routers"

$env:GIT_AUTHOR_DATE="2026-03-14T10:05:00"
$env:GIT_COMMITTER_DATE="2026-03-14T10:05:00"
git add routers\Roles\ routers\subuser.py
git commit -m "Backend: Create role-based access control and subuser APIs"

$env:GIT_AUTHOR_DATE="2026-03-16T15:30:00"
$env:GIT_COMMITTER_DATE="2026-03-16T15:30:00"
git add routers\dashboard.py routers\clubs.py routers\countries.py routers\migration.py
git commit -m "Backend: Add dashboard analytics and supporting APIs"

$env:GIT_AUTHOR_DATE="2026-03-17T11:50:00"
$env:GIT_COMMITTER_DATE="2026-03-17T11:50:00"
git add main.py .gitignore .env.example README.md
git commit -m "Backend: Integrate routers into main FastAPI application and add documentation"

$env:GIT_AUTHOR_DATE="2026-03-18T09:25:00"
$env:GIT_COMMITTER_DATE="2026-03-18T09:25:00"
git add vehicles-parking-system-frontend\.gitignore vehicles-parking-system-frontend\package* vehicles-parking-system-frontend\vite.config.mjs vehicles-parking-system-frontend\index.html
git commit -m "Frontend: Initialize React application"

$env:GIT_AUTHOR_DATE="2026-03-18T14:40:00"
$env:GIT_COMMITTER_DATE="2026-03-18T14:40:00"
git add vehicles-parking-system-frontend\src\components\ vehicles-parking-system-frontend\src\layout\ vehicles-parking-system-frontend\src\assets\ vehicles-parking-system-frontend\src\scss\ vehicles-parking-system-frontend\public\
git commit -m "Frontend: Scaffold UI components, assets, and layout"

$env:GIT_AUTHOR_DATE="2026-03-19T10:15:00"
$env:GIT_COMMITTER_DATE="2026-03-19T10:15:00"
git add vehicles-parking-system-frontend\src\views\ vehicles-parking-system-frontend\src\App.js vehicles-parking-system-frontend\src\routes.js vehicles-parking-system-frontend\src\index.js vehicles-parking-system-frontend\src\_nav.js vehicles-parking-system-frontend\src\store.js vehicles-parking-system-frontend\src\apiConfig.js
git commit -m "Frontend: Build application pages, integration, and routing"

$env:GIT_AUTHOR_DATE="2026-03-20T09:00:00"
$env:GIT_COMMITTER_DATE="2026-03-20T09:00:00"
git add .
git commit -m "Final cleanup and project polish"

git remote add origin https://github.com/hrxharshit1/vehicles-parking-system.git
git branch -M main
git log --oneline

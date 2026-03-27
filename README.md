## CHẠY MODEL INTENT

    uvicorn main:app --port 8001

## KIỂM TRA PORT

    netstat -ano | findstr :xxxx

    tasklist | findstr xxxx

    taskkill /PID xxxx /F

### CHẠY SERVER BACKEND

    cd fitness-be

    composer install

    php artisan migrate:fresh --seed

    php artisan config:clear

    php artisan cache:clear

    php artisan serve

    php artisan queue:work

    php artisan reverb:start

    php artisan pt:expire
## Run frontend app

    npm run dev

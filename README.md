## KIỂM TRA PORT

    netstat -ano | findstr :xxxx

    tasklist | findstr xxxx

    taskkill /PID xxxx /F

### CHẠY SERVER BACKEND

    cd fitness-be

    php artisan config:clear

    php artisan cache:clear

    php artisan serve

    php artisan queue:work

    php artisan reverb:start

## Run frontend app

    npm run dev

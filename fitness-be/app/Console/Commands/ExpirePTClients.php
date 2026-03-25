<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\PersonalTrainerClient;
use Carbon\Carbon;

class ExpirePTClients extends Command
{
    protected $signature = 'pt:expire';
    protected $description = 'Auto expire PT clients when end_date passed';

    public function handle()
    {
        $count = PersonalTrainerClient::where('status', 'active')
            ->whereDate('end_date', '<', Carbon::today())
            ->update([
                'status' => 'expired'
            ]);

        $this->info("Expired {$count} PT clients.");
    }
}

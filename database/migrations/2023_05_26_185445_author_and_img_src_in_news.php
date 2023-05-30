<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */

     public function up()
     {
         Schema::table('news', function (Blueprint $table) {
             $table->string('author')->nullable()->after('source');
             $table->string('image_src')->nullable()->after('author');
         });
     }
 
     /**
      * Reverse the migrations.
      *
      * @return void
      */
     public function down()
     {
         Schema::table('news', function (Blueprint $table) {
             $table->dropColumn('author');
             $table->dropColumn('image_src');
         });
     }
};

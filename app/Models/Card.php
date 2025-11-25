<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Card extends Model
{
    use HasFactory;

    public const TYPES = ['lucky', 'danger', 'question'];

    public const STATUSES = ['draft', 'active', 'inactive'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'uuid',
        'type',
        'question',
        'answer',
        'status',
        'media_path',
        'media_original_name',
        'media_mime',
        'alt_video_url',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'uuid' => 'string',
    ];

    /**
     * Automatically assign a UUID when creating the model.
     */
    protected static function booted(): void
    {
        static::creating(function (Card $card) {
            if (empty($card->uuid)) {
                $card->uuid = (string) Str::uuid();
            }
        });
    }

    /**
     * Convenience helper for the available card types.
     *
     * @return array<int, string>
     */
    public static function types(): array
    {
        return self::TYPES;
    }

    /**
     * Convenience helper for the available status values.
     *
     * @return array<int, string>
     */
    public static function statuses(): array
    {
        return self::STATUSES;
    }

    /**
     * Scope a query to only include active cards.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}

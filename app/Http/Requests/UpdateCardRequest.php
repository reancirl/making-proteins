<?php

namespace App\Http\Requests;

use App\Models\Card;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCardRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'type' => ['required', Rule::in(Card::TYPES)],
            'question' => ['required', 'string', 'max:500'],
            'answer' => ['required', 'string'],
            'status' => ['required', Rule::in(Card::STATUSES)],
            'alt_video_url' => ['nullable', 'url', 'max:2048'],
            'media' => [
                'nullable',
                'file',
                'max:204800',
                'mimetypes:image/jpeg,image/png,image/gif,image/webp,image/svg+xml,video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv,video/mpeg,video/3gpp,video/ogg,video/webm',
            ],
        ];
    }
}

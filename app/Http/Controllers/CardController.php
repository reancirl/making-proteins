<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCardRequest;
use App\Http\Requests\UpdateCardRequest;
use App\Models\Card;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Writer\SvgWriter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CardController extends Controller
{
    /**
     * Display a listing of the cards.
     */
    public function index(): Response
    {
        $cards = Card::query()
            ->latest()
            ->paginate(10)
            ->through(fn (Card $card) => $this->serializeCard($card));

        return Inertia::render('cards/index', [
            'cards' => $cards,
            'typeOptions' => Card::types(),
            'statusOptions' => Card::statuses(),
        ]);
    }

    /**
     * Show the form for creating a new card.
     */
    public function create(): Response
    {
        return Inertia::render('cards/create', [
            'typeOptions' => Card::types(),
            'statusOptions' => Card::statuses(),
        ]);
    }

    /**
     * Store a newly created card in storage.
     */
    public function store(StoreCardRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('media')) {
            $media = $request->file('media');
            $data['media_path'] = $media->store('cards', 'public');
            $data['media_original_name'] = $media->getClientOriginalName();
            $data['media_mime'] = $media->getClientMimeType();
        }

        Card::create($data);

        return redirect()
            ->route('cards.index')
            ->with('status', 'Card created successfully.');
    }

    /**
     * Show the form for editing the specified card.
     */
    public function edit(Card $card): Response
    {
        return Inertia::render('cards/edit', [
            'card' => $this->serializeCard($card, includeAnswer: true),
            'typeOptions' => Card::types(),
            'statusOptions' => Card::statuses(),
        ]);
    }

    /**
     * Update the specified card in storage.
     */
    public function update(UpdateCardRequest $request, Card $card): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('media')) {
            if ($card->media_path) {
                Storage::disk('public')->delete($card->media_path);
            }

            $media = $request->file('media');
            $data['media_path'] = $media->store('cards', 'public');
            $data['media_original_name'] = $media->getClientOriginalName();
            $data['media_mime'] = $media->getClientMimeType();
        }

        $card->update($data);

        return redirect()
            ->route('cards.index')
            ->with('status', 'Card updated successfully.');
    }

    /**
     * Remove the specified card from storage.
     */
    public function destroy(Card $card): RedirectResponse
    {
        if ($card->media_path) {
            Storage::disk('public')->delete($card->media_path);
        }

        $card->delete();

        return redirect()
            ->route('cards.index')
            ->with('status', 'Card deleted.');
    }

    /**
     * Display the public view of the specified card, only when active.
     */
    public function publicShow(Card $card): Response
    {
        abort_unless($card->status === 'active', 404);

        return Inertia::render('cards/public', [
            'card' => $this->serializeCard($card, includeAnswer: true),
        ]);
    }

    /**
     * Show a full-screen QR preview for print/download.
     */
    public function qrPreview(Card $card): Response
    {
        return Inertia::render('cards/qr', [
            'card' => [
                'id' => $card->id,
                'uuid' => $card->uuid,
                'type' => $card->type,
                'status' => $card->status,
                'question' => $card->question,
                'public_url' => route('cards.public', ['card' => $card->uuid]),
            ],
            'qrImageUrl' => route('cards.qr-image', $card),
            'downloadUrl' => route('cards.qr-image', [
                'card' => $card->id,
                'download' => true,
            ]),
        ]);
    }

    /**
     * Stream the QR code image (proxied through Google Charts).
     */
    public function qrImage(Request $request, Card $card)
    {
        $size = (int) $request->query('size', 800);
        $size = max(100, min(2000, $size));

        $publicUrl = route('cards.public', ['card' => $card->uuid]);
        $qrBinary = $this->generateQrImage($publicUrl, $size);

        $headers = [
            'Content-Type' => 'image/svg+xml',
        ];

        if ($request->boolean('download')) {
            $filename = 'card-'.$card->uuid.'.svg';
            $headers['Content-Disposition'] = 'attachment; filename="'.$filename.'"';
        }

        return response($qrBinary, 200, $headers);
    }

    /**
     * Transform a card into an array that Inertia can consume.
     */
    private function serializeCard(Card $card, bool $includeAnswer = false): array
    {
        $mediaPath = $card->media_path
            ? Storage::disk('public')->url($card->media_path)
            : null;

        $mediaUrl = $mediaPath ? url($mediaPath) : null;

        return [
            'id' => $card->id,
            'uuid' => $card->uuid,
            'type' => $card->type,
            'question' => $card->question,
            'answer' => $includeAnswer ? $card->answer : null,
            'answer_preview' => Str::of($card->answer)->limit(120)->toString(),
            'status' => $card->status,
            'alt_video_url' => $card->alt_video_url,
            'media' => $mediaUrl
                ? [
                    'url' => $mediaUrl,
                    'name' => $card->media_original_name,
                    'mime' => $card->media_mime,
                ]
                : null,
            'public_url' => route('cards.public', ['card' => $card->uuid]),
            'updated_at' => optional($card->updated_at)->toDateTimeString(),
            'created_at' => optional($card->created_at)->toDateTimeString(),
        ];
    }

    private function generateQrImage(string $data, int $size): string
    {
        $result = Builder::create()
            ->writer(new SvgWriter())
            ->encoding(new Encoding('UTF-8'))
            ->errorCorrectionLevel(ErrorCorrectionLevel::High)
            ->data($data)
            ->margin(10)
            ->size($size)
            ->build();

        return $result->getString();
    }
}

<?php

namespace App\Requests\V1\Msg\MessageTimeline;

use App\Libraries\Msg\ContentFilter;

/**
 * Sanitização do termo de busca para GET /msg-timeline-view/search?q=...
 * O termo é filtrado pelo ContentFilter antes de consultar a view.
 */
class SearchRequest
{
    /** Sanitiza o termo de busca livre (parâmetro ?q=). */
    public function sanitizeTerm(string $term): string
    {
        return ContentFilter::sanitize($term);
    }
}

package fanfare.tg.services;


import fanfare.tg.model.dto.PendingCommentDto;

import java.sql.Timestamp;
import java.util.List;

public interface PendingCommentsService {
    void addComment(PendingCommentDto pendingComment);

    void deleteComment(PendingCommentDto pendingComment);

    List<PendingCommentDto> getAllInChatBefore(long tgChatId, Timestamp timestamp);
}

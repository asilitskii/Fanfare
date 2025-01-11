package fanfare.tg.services.impl;

import fanfare.tg.model.dto.PendingCommentDto;
import fanfare.tg.model.entities.PendingCommentEntity;
import fanfare.tg.repositories.ClientRepository;
import fanfare.tg.repositories.PendingCommentsRepository;
import fanfare.tg.services.PendingCommentsService;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
@AllArgsConstructor
@Log
public class PendingCommentsImpl implements PendingCommentsService {

    private final ModelMapper modelMapper;
    private final PendingCommentsRepository pendingCommentsRepository;
    private final ClientRepository clientRepository;

    @Override
    public void addComment(PendingCommentDto pendingComment) {
        if (clientRepository.findById_TgChatIdAndId_TgUserId(pendingComment.getTgChatId(), pendingComment.getTgUserId()).isEmpty()) {
            return;
        }

        PendingCommentEntity pendingCommentEntity = modelMapper.map(pendingComment, PendingCommentEntity.class);
        pendingCommentsRepository.insert(pendingCommentEntity);
    }

    @Override
    public void deleteComment(PendingCommentDto pendingComment) {
        PendingCommentEntity pendingCommentEntity = modelMapper.map(pendingComment, PendingCommentEntity.class);
        pendingCommentsRepository.delete(pendingCommentEntity);
    }

    @Override
    public List<PendingCommentDto> getAllInChatBefore(long tgChatId, Timestamp timestamp) {
        return pendingCommentsRepository.findById_TgChatIdAndTimeLessThan(tgChatId, timestamp).
                stream().
                map(entity -> modelMapper.map(entity, PendingCommentDto.class)).
                toList();
    }
}

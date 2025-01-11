package fanfare.tg.services.impl;

import fanfare.tg.model.dto.PendingBoostDto;
import fanfare.tg.model.entities.PendingBoostEntity;
import fanfare.tg.repositories.ClientRepository;
import fanfare.tg.repositories.PendingBoostsRepository;
import fanfare.tg.services.PendingBoostsService;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
@AllArgsConstructor
@Log
public class PendingBoostsImpl implements PendingBoostsService {

    private final ModelMapper modelMapper;
    private final PendingBoostsRepository pendingBoostsRepository;
    private final ClientRepository clientRepository;

    @Override
    public void addBoost(PendingBoostDto pendingBoost) {
        if (clientRepository.findById_TgChannelIdAndId_TgUserId(pendingBoost.getTgChannelId(), pendingBoost.getTgUserId()).isEmpty()) {
            return;
        }
        PendingBoostEntity pendingBoostEntity = modelMapper.map(pendingBoost, PendingBoostEntity.class);
        pendingBoostsRepository.insert(pendingBoostEntity);
    }

    @Override
    public void deleteBoost(PendingBoostDto pendingBoost) {
        PendingBoostEntity pendingBoostEntity = modelMapper.map(pendingBoost, PendingBoostEntity.class);
        pendingBoostsRepository.delete(pendingBoostEntity);
    }

    @Override
    public List<PendingBoostDto> getAllInChannelBefore(long tgChannelId, Timestamp timestamp) {
        return pendingBoostsRepository.findById_TgChannelIdAndTimeLessThan(tgChannelId, timestamp).
                stream().
                map(entity -> modelMapper.map(entity, PendingBoostDto.class)).
                toList();
    }

    @Override
    public void deleteBoost(String boostId) {
        pendingBoostsRepository.deleteById_BoostId(boostId);
    }
}

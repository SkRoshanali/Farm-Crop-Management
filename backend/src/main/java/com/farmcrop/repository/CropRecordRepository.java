package com.farmcrop.repository;

import com.farmcrop.entity.CropRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CropRecordRepository extends JpaRepository<CropRecord, Long> {
    
    @Query("SELECT cr FROM CropRecord cr " +
           "JOIN FETCH cr.field f " +
           "JOIN FETCH cr.crop c " +
           "WHERE f.id = :fieldId")
    List<CropRecord> findByFieldId(Long fieldId);
    
    @Query("SELECT cr FROM CropRecord cr " +
           "JOIN FETCH cr.field f " +
           "JOIN FETCH cr.crop c " +
           "WHERE c.id = :cropId")
    List<CropRecord> findByCropId(Long cropId);

    @Query("SELECT cr FROM CropRecord cr " +
           "JOIN FETCH cr.field f " +
           "JOIN FETCH cr.crop c " +
           "JOIN FETCH f.farmer " +
           "WHERE f.farmer.id = :farmerId")
    List<CropRecord> findAllByFarmerId(Long farmerId);
}

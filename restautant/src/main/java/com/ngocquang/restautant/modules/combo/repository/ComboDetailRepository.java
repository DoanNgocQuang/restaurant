package com.ngocquang.restautant.modules.combo.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ngocquang.restautant.modules.combo.entity.ComboDetail;

@Repository
public interface ComboDetailRepository extends JpaRepository<ComboDetail,Integer> {
    List<ComboDetail> findByComboId(Integer comboId);

    void deleteByComboId(Integer comboId);
}

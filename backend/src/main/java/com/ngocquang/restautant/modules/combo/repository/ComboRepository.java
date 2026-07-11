package com.ngocquang.restautant.modules.combo.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ngocquang.restautant.modules.combo.entity.Combo;

@Repository
public interface ComboRepository extends JpaRepository<Combo,Integer> {
}
